/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { ModuleAdapter, ModuleId } from '@abc-map/module-api';
import React from 'react';
import { Services } from '../../core/Services';
import {
  AbcFile,
  ArtefactManifest,
  isProjectionEqual,
  Logger,
  normalizedProjectionName,
  WmsDefinitionManifest,
  WmtsDefinitionManifest,
  XyzDefinitionManifest,
  Zipper,
  LayerType,
  ArtefactType,
} from '@abc-map/shared';
import { defaultPreviewViews, newParameters, Parameters, ProgressHandler } from './typings';
import ArtefactGeneratorUi from './view/ArtefactGeneratorView';
import { FileIO } from '../../core/utils/FileIO';
import yaml from 'js-yaml';
import { LayerFactory } from '../../core/geo/layers/LayerFactory';
import { PreviewExporter } from './PreviewExporter';
import { DimensionsPx } from '../../core/utils/DimensionsPx';
import { WmsSettings, WmtsSettings } from '../../core/geo/layers/LayerFactory.types';
import { toSlug } from '../../core/utils/toSlug';
import { LocalModuleId } from '../LocalModuleId';
import { prefixedTranslation } from '../../i18n/i18n';
import { isOpenlayersProjection } from '../../core/utils/crossContextInstanceof';

const t = prefixedTranslation('ArtefactGeneratorModule:');

export const logger = Logger.get('ArtefactGenerator.tsx', 'info');

/**
 * This module generates artifacts usable in the datastore from url XYZ, WMS, or WMTS.
 *
 * It will remain an experimental feature since there is little chance that it will interest ordinary users.
 */
export class ArtefactGeneratorModule extends ModuleAdapter {
  public static create(services: Services): ArtefactGeneratorModule {
    return new ArtefactGeneratorModule(services, new PreviewExporter());
  }

  private parameters = newParameters();

  constructor(private services: Services, private previewExporter: PreviewExporter) {
    super();
  }

  public getId(): ModuleId {
    return LocalModuleId.ArtefactGenerator;
  }

  public getReadableName(): string {
    return t('Artefact_generator');
  }

  public getShortDescription(): string {
    return t('Generate_data_store_artefacts');
  }

  public getView() {
    return <ArtefactGeneratorUi initialValue={this.parameters} onChange={this.handleParametersChange} onProcess={this.process} />;
  }

  public process = async (onProgress: ProgressHandler): Promise<void> => {
    if (!this.parameters.previews.views) {
      this.parameters.previews.views = defaultPreviewViews();
    }

    // Create artefact files
    let files: AbcFile<Blob>[] = [];
    switch (this.parameters.type) {
      case LayerType.Xyz:
        files = await this.xyzArtefact(this.parameters, onProgress);
        break;
      case LayerType.Wms:
        files = await this.wmsArtefacts(this.parameters, onProgress);
        break;
      case LayerType.Wmts:
        files = await this.wmtsArtefacts(this.parameters, onProgress);
        break;
      default:
        throw new Error(`Not supported: ${this.parameters.type}`);
    }

    // Zip then download
    const zip = await Zipper.forBrowser().zipFiles(files);
    FileIO.outputBlob(zip, 'artefact.zip');
  };

  /**
   * This method creates one artefact per XYZ url
   */
  public async xyzArtefact(params: Parameters, onProgress: ProgressHandler): Promise<AbcFile<Blob>[]> {
    const files: AbcFile<Blob>[] = [];

    onProgress({ total: 1, done: 0 });

    // Include definition
    const definition: XyzDefinitionManifest = {
      version: '0.0.1',
      xyz: { url: params.xyz.url },
    };
    files.push({ path: 'definition.xyz', content: new Blob([yaml.dump(definition)]) });

    // Include previews
    let images: Blob[] = [];
    if (params.previews.enabled && params.previews.views.length) {
      const layer = LayerFactory.newXyzLayer(params.xyz.url);
      images = await this.previewExporter.exportPreviews(layer, params.previews.views, previewDimensions());
      files.push(...images.map((image, i) => ({ path: `preview-${i}.png`, content: image })));
    }

    // Include license
    files.push(license(licenseFileName(), params));

    // Include manifest
    const manifest: ArtefactManifest = {
      version: '0.0.1',
      artefact: {
        name: params.name,
        type: ArtefactType.BaseMap,
        description: params.description,
        keywords: formatKeywords(params),
        provider: params.provider,
        link: params.link,
        license: licenseFileName(),
        attributions: formatAttributions(params),
        files: ['definition.xyz'],
      },
    };

    if (params.previews.enabled) {
      manifest.artefact.previews = images.map((image, i) => `preview-${i}.png`);
    }

    files.push({ path: `artefact.yml`, content: new Blob([yaml.dump(manifest)]) });

    onProgress({ total: 1, done: 1 });

    return files;
  }

  /**
   * This methode create one artefact per WMS layer
   */
  public async wmsArtefacts(params: Parameters, onProgress: ProgressHandler): Promise<AbcFile<Blob>[]> {
    const { geo, toasts } = this.services;
    const files: AbcFile<Blob>[] = [];

    const capabilities = await geo.getWmsCapabilities(params.wms.url, params.auth);
    let layers = capabilities?.Capability?.Layer?.Layer || [];

    if (!layers.length) {
      return Promise.reject(new Error('No layers found'));
    }

    if (params.layerIndexes.offset !== -1 && params.layerIndexes.limit !== -1) {
      layers = layers.slice(params.layerIndexes.offset, params.layerIndexes.limit);
    }

    onProgress({ total: layers.length, done: 0 });

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];

      try {
        // We grab layer name and WMS urls
        const remoteLayerName = layer.Name || '';
        const dcpTypes = capabilities?.Capability?.Request?.GetMap?.DCPType;
        const remoteUrls = dcpTypes?.map((dcpType) => dcpType.HTTP?.Get?.OnlineResource).filter((url): url is string => typeof url === 'string' && !!url);
        if (!remoteLayerName || !remoteUrls || !remoteUrls.length) {
          logger.error('Invalid layer name or URLs');
          continue;
        }

        // Layer slug is used as directory name for artefacts
        const layerSlug = toSlug(remoteLayerName);

        // We try to the project projection, otherwise we use the first projection available
        let projectionName = layer.CRS?.find((crs) => isProjectionEqual(crs, 'EPSG:3857'));
        if (!projectionName) {
          // FIXME: we should try to load projection in order to ensure we can use it
          projectionName = layer.CRS?.find((crs) => normalizedProjectionName(crs));
        }

        // We load projection if any
        if (projectionName) {
          await geo.loadProjection(projectionName);
        }

        const wmsSettings: WmsSettings = {
          remoteUrls,
          remoteLayerName,
          projection: projectionName ? { name: projectionName } : undefined,
          auth: params.auth,
        };

        // Include previews
        let images: Blob[] = [];
        if (params.previews.enabled && params.previews.views.length) {
          const previewLayer = LayerFactory.newWmsLayer(wmsSettings);
          images = await this.previewExporter.exportPreviews(previewLayer, params.previews.views, previewDimensions());
          files.push(...images.map((preview, i) => ({ path: `${layerSlug}/preview-${i}.png`, content: preview })));
        }

        // Include license
        files.push(license(`${layerSlug}/${licenseFileName()}`, params));

        // Include definition
        const definition: WmsDefinitionManifest = {
          version: '0.0.1',
          wms: {
            urls: wmsSettings.remoteUrls,
            remoteLayerName: wmsSettings.remoteLayerName,
            projection: wmsSettings.projection,
            extent: wmsSettings.extent,
            auth: params.auth,
          },
        };
        files.push({ path: `${layerSlug}/definition.wms`, content: new Blob([yaml.dump(definition)]) });

        // Include manifest
        const manifest: ArtefactManifest = {
          version: '0.0.1',
          artefact: {
            name: params.name.map((name) => ({ ...name, text: `${name.text} ${layer.Name || ''}` })),
            type: ArtefactType.BaseMap,
            description: params.description.map((desc) => ({ ...desc, text: `${desc.text} ${layer.Abstract || ''}` })),
            keywords: formatKeywords(params),
            provider: params.provider,
            link: params.link,
            license: licenseFileName(),
            attributions: formatAttributions(params),
            files: ['definition.wms'],
          },
        };

        if (params.previews.enabled) {
          manifest.artefact.previews = images.map((preview, i) => `preview-${i}.png`);
        }

        files.push({ path: `${layerSlug}/artefact.yml`, content: new Blob([yaml.dump(manifest)]) });
      } catch (err) {
        toasts.genericError(err);
        logger.error('Generation failed: ', err);
      }

      onProgress({ total: layers.length, done: i + 1 });
    }

    return files;
  }

  /**
   * This methode create one artefact per WMTS layer
   */
  public async wmtsArtefacts(params: Parameters, onProgress: ProgressHandler): Promise<AbcFile<Blob>[]> {
    const { geo, toasts } = this.services;
    const files: AbcFile<Blob>[] = [];

    const capabilities = await geo.getWmtsCapabilities(params.wmts.url, params.auth);
    let layers = capabilities?.Contents?.Layer || [];

    if (!layers.length) {
      return Promise.reject(new Error('No layers found'));
    }

    if (params.layerIndexes.offset !== -1 && params.layerIndexes.limit !== -1) {
      layers = layers.slice(params.layerIndexes.offset, params.layerIndexes.limit);
    }

    onProgress({ total: layers.length, done: 0 });

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];

      try {
        // We grab layer name and WMTS urls
        const remoteLayerName = layer.Identifier;
        if (!remoteLayerName) {
          return Promise.reject(new Error('Layer does not have identifier'));
        }

        // Layer slug is used as directory name for artefacts
        const layerSlug = toSlug(remoteLayerName);

        // Options are used to create a new layer
        const options = await geo.getWmtsLayerOptions(remoteLayerName, capabilities);

        // We load projection if needed
        let projection: string | undefined;
        if (options.projection && isOpenlayersProjection(options.projection)) {
          projection = normalizedProjectionName(options.projection.getCode());
        } else if (options.projection && typeof options.projection === 'string') {
          projection = normalizedProjectionName(options.projection);
        }
        if (projection) {
          // FIXME: we should try to load and try others options on fail
          await geo.loadProjection(projection);
        }

        // Include previews
        const wmtsSettings: WmtsSettings = {
          capabilitiesUrl: params.wmts.url,
          remoteLayerName,
          sourceOptions: options,
          auth: params.auth,
        };

        let images: Blob[] = [];
        if (params.previews.enabled && params.previews.views.length) {
          const previewLayer = LayerFactory.newWmtsLayer(wmtsSettings);
          images = await this.previewExporter.exportPreviews(previewLayer, params.previews.views, previewDimensions());
          files.push(...images.map((preview, i) => ({ path: `${layerSlug}/preview-${i}.png`, content: preview })));
        }

        // Include license
        files.push(license(`${layerSlug}/${licenseFileName()}`, params));

        // Include definition
        const definition: WmtsDefinitionManifest = {
          version: '0.0.1',
          wmts: {
            capabilitiesUrl: wmtsSettings.capabilitiesUrl,
            remoteLayerName,
            auth: params.auth,
          },
        };
        files.push({ path: `${layerSlug}/definition.wmts`, content: new Blob([yaml.dump(definition)]) });

        // Include manifest
        const manifest: ArtefactManifest = {
          version: '0.0.1',
          artefact: {
            name: params.name.map((name) => ({ ...name, text: `${name.text} ${layer.Identifier || ''}` })),
            type: ArtefactType.BaseMap,
            description: params.description.map((desc) => ({ ...desc, text: `${desc.text} ${layer.Abstract || ''}` })),
            keywords: formatKeywords(params),
            provider: params.provider,
            link: params.link,
            license: licenseFileName(),
            attributions: formatAttributions(params),
            files: ['definition.wmts'],
          },
        };

        if (params.previews.enabled) {
          manifest.artefact.previews = images.map((preview, i) => `preview-${i}.png`);
        }

        files.push({ path: `${layerSlug}/artefact.yml`, content: new Blob([yaml.dump(manifest)]) });
      } catch (err) {
        toasts.genericError(err);
        logger.error('Generation failed: ', err);
      }

      onProgress({ total: layers.length, done: i + 1 });
    }

    return files;
  }

  private handleParametersChange = (parameters: Parameters) => {
    this.parameters = parameters;
  };
}

function licenseFileName(): string {
  return 'LICENSE.txt';
}

function license(path: string, params: Parameters): AbcFile<Blob> {
  return { path, content: new Blob([params.license]) };
}

function previewDimensions(): DimensionsPx {
  return { width: 1600, height: 1000 };
}

function formatAttributions(params: Parameters): string[] {
  return params.attributions
    .split('\n')
    .map((l) => l.trim())
    .filter((s) => !!s);
}

function formatKeywords(params: Parameters) {
  return params.keywords.map((keywords) => ({ language: keywords.language, text: keywords.text.split(';').map((k) => k.trim()) })).filter((k) => !!k);
}
