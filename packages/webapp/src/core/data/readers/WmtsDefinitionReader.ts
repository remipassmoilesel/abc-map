/**
 * Copyright © 2026 Rémi Pace.
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

import type { ReaderImplementation } from './ReaderImplementation';
import { FileFormat, FileFormats } from '../FileFormats';
import type { AbcFile, WmtsDefinitionManifest } from '@abc-map/shared';
import { BlobIO, Logger, normalizedProjectionName } from '@abc-map/shared';
import yaml from 'js-yaml';
import type { LayerWrapper } from '../../geo/layers/LayerWrapper';
import { LayerFactory } from '../../geo/layers/LayerFactory';
import type { ModalService } from '../../ui/ModalService';
import type { VariableMap } from '../../utils/variableExpansion';
import { variableExpansion } from '../../utils/variableExpansion';
import { ModalStatus } from '../../ui/typings';
import { prefixedTranslation } from '../../../i18n/i18n';
import type { WmtsSettings } from '../../geo/layers/LayerFactory.types';
import type { GeoService } from '../../geo/GeoService';
import type { ReadResult } from '../ReadResult';
import { ReadStatus } from '../ReadResult';
import { isOpenlayersProjection } from '../../utils/instanceof.ts';

const logger = Logger.get('WmtsDefinitionReader.ts');

const t = prefixedTranslation('DataReader');

export class WmtsDefinitionReader implements ReaderImplementation {
  constructor(
    private geo: GeoService,
    private modals: ModalService,
  ) {}

  public async isSupported(files: AbcFile<Blob>[]): Promise<boolean> {
    return files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.WMTS_DEFINITION).length > 0;
  }

  public async read(files: AbcFile<Blob>[]): Promise<ReadResult> {
    const definitions = files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.WMTS_DEFINITION);
    const layers: LayerWrapper[] = [];
    for (const file of definitions) {
      const fileContent = await BlobIO.asString(file.content);
      const definition = yaml.load(fileContent) as WmtsDefinitionManifest | undefined;
      if (!definition || !definition.wmts.capabilitiesUrl || !definition.wmts.remoteLayerName) {
        return Promise.reject(new Error(`Invalid WMTS definition: ${JSON.stringify(definition)}`));
      }

      let variables: VariableMap = {};
      if (definition.wmts.prompt) {
        const result = await this.modals.promptVariables(t('Further_information'), t('You_must_full_in_this_form'), definition.wmts.prompt);
        if (result.status === ModalStatus.Canceled) {
          return { status: ReadStatus.Canceled, layers };
        }
        variables = result.variables;
      }

      const capabilitiesUrl = variableExpansion(definition.wmts.capabilitiesUrl, variables);
      const authentication = definition.wmts.auth
        ? {
            username: variableExpansion(definition.wmts.auth.username, variables),
            password: variableExpansion(definition.wmts.auth.password, variables),
          }
        : undefined;

      // We load capabilities and options to create a new layer
      const capabilities = await this.geo.getWmtsCapabilities(capabilitiesUrl, authentication);
      const options = await this.geo.getWmtsLayerOptions(definition.wmts.remoteLayerName, capabilities);

      // We load projection if needed
      let projection: string | undefined;
      if (options.projection && isOpenlayersProjection(options.projection)) {
        projection = normalizedProjectionName(options.projection.getCode());
      } else if (options.projection && typeof options.projection === 'string') {
        projection = normalizedProjectionName(options.projection);
      }
      if (projection) {
        // FIXME: we should try to load and try others options on fail
        await this.geo.loadProjection(projection);
      }

      // We create a layer
      const wmtsSettings: WmtsSettings = {
        capabilitiesUrl,
        remoteLayerName: definition.wmts.remoteLayerName,
        sourceOptions: options,
        auth: authentication,
      };

      layers.push(LayerFactory.newWmtsLayer(wmtsSettings));
    }

    return { status: ReadStatus.Succeed, layers };
  }
}
