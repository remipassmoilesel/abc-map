/**
 * Copyright © 2023 Rémi Pace.
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

import { DateTime } from 'luxon';
import { getServices, Services } from '../Services';
import { prefixedTranslation } from '../../i18n/i18n';
import { GpxReader } from './readers/GpxReader';
import { KmlReader } from './readers/KmlReader';
import { ShapefileReader } from './readers/ShapefileReader';
import { GeoJsonReader } from './readers/GeoJsonReader';
import { WmsDefinitionReader } from './readers/WmsDefinitionReader';
import { ReaderImplementation as DataReaderImplem } from './readers/ReaderImplementation';
import { AbcArtefact, AbcFile, AbcProjection, Zipper } from '@abc-map/shared';
import { FileFormat, FileFormats } from './FileFormats';
import { ModalStatus } from '../ui/typings';
import { AddLayersChangeset } from '../history/changesets/layers/AddLayersChangeset';
import { HistoryKey } from '../history/HistoryKey';
import { getArea } from 'ol/extent';
import { XyzDefinitionReader } from './readers/XyzDefinitionReader';
import { WmtsDefinitionReader } from './readers/WmtsDefinitionReader';
import { ReadResult, ReadStatus } from './ReadResult';
import { attributionsVariableExpansion } from '../utils/variableExpansion';
import { WktReader } from './readers/WktReader';
import { TopoJsonReader } from './readers/TopoJsonReader';
import { UiConstants } from '../ui/UiConstants';

const t = prefixedTranslation('DataReader:');

export const readersFactory = (services: Services) => [
  new GpxReader(),
  new KmlReader(),
  new ShapefileReader(),
  new GeoJsonReader(),
  new WktReader(),
  new TopoJsonReader(),
  new WmsDefinitionReader(services.geo, services.modals),
  new WmtsDefinitionReader(services.geo, services.modals),
  new XyzDefinitionReader(services.geo, services.modals),
];

export class DataReader {
  public static create(): DataReader {
    return new DataReader(getServices(), readersFactory(getServices()));
  }

  constructor(private services: Services, private readers: DataReaderImplem[]) {}

  public async read(files: AbcFile<Blob>[], targetProjection: AbcProjection): Promise<ReadResult> {
    if (!files.length) {
      throw new Error('No file provided');
    }

    // First we unzip if needed
    const _files: AbcFile<Blob>[] = [];
    for (const f of files) {
      if (FileFormats.fromPath(f.path) === FileFormat.ZIP) {
        const unzipped = await Zipper.forBrowser().unzip(f.content);
        _files.push(...unzipped);
      } else {
        _files.push(f);
      }
    }

    // Then we create layers from data
    const result: ReadResult = { status: ReadStatus.Succeed, layers: [] };
    for (const reader of this.readers) {
      // We read files
      if (await reader.isSupported(_files)) {
        const r = await reader.read(_files, targetProjection);

        // Read succeed, we store layers
        if (r.status === ReadStatus.Succeed && r.layers) {
          result.layers?.push(...r.layers);
        }

        // Operation failed or canceled, we stop reading
        else {
          return { status: r.status };
        }
      }
    }

    if (!result.layers?.length) {
      result.status = ReadStatus.Failed;
    }

    return result;
  }

  public async importFiles(files: AbcFile<Blob>[]): Promise<ReadResult> {
    const { modals, history, geo } = this.services;

    // We check if files are not too big
    const bigFiles = files.filter((f) => f.content.size >= UiConstants.IMPORT_FILE_SIZE_MAX);
    if (bigFiles.length && (await modals.dataSizeWarning()) === ModalStatus.Canceled) {
      return { status: ReadStatus.Canceled, layers: [] };
    }

    // We read files
    const map = geo.getMainMap();
    const readResult = await this.read(files, map.getProjection());
    const layers = readResult.layers;
    if (readResult.status !== ReadStatus.Succeed || !layers?.length) {
      return { status: readResult.status, layers: [] };
    }

    // We check if layers are not too big
    const bigLayers = layers.filter((lay) => lay.isVector() && lay.getSource().getFeatures().length > UiConstants.FEATURE_PER_LAYER_MAX);
    if (!bigFiles.length && bigLayers.length && (await modals.dataSizeWarning()) === ModalStatus.Canceled) {
      return { status: ReadStatus.Canceled, layers: [] };
    }

    // We add layers
    const hour = DateTime.local().toFormat('HH:mm');
    layers.forEach((lay, i) => lay.setName(t('Import_of', { hour, n: i + 1 })));

    const cs = AddLayersChangeset.create(layers);
    await cs.execute();
    history.register(HistoryKey.Map, cs);

    // We fit view on last one
    const last = layers[layers.length - 1];
    const extent = last.unwrap().getExtent();
    if (extent && getArea(extent)) {
      map.unwrap().getView().fit(extent);
    }

    return { status: ReadStatus.Succeed, layers };
  }

  public async importArtefact(artefact: AbcArtefact): Promise<ReadResult> {
    const { dataStore } = this.services;

    // Download then import files
    const files = await dataStore.downloadFilesFrom(artefact);
    const result = await this.importFiles(files);

    // Add attributions
    result.layers?.forEach((lay) => lay.setAttributions(attributionsVariableExpansion(artefact.attributions)));
    return result;
  }
}
