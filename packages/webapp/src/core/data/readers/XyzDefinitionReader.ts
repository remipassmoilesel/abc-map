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

import { ReaderImplementation } from './ReaderImplementation';
import { FileFormat, FileFormats } from '../FileFormats';
import { AbcFile, BlobIO, Logger, XyzDefinitionManifest } from '@abc-map/shared';
import * as yaml from 'js-yaml';
import { LayerWrapper } from '../../geo/layers/LayerWrapper';
import { LayerFactory } from '../../geo/layers/LayerFactory';
import { ModalService } from '../../ui/ModalService';
import { variableExpansion, VariableMap } from '../../utils/variableExpansion';
import { ModalStatus } from '../../ui/typings';
import { prefixedTranslation } from '../../../i18n/i18n';
import { ReadResult, ReadStatus } from '../ReadResult';
import { GeoService } from '../../geo/GeoService';

const logger = Logger.get('XyzDefinitionReader.ts');

const t = prefixedTranslation('DataReader:');

export class XyzDefinitionReader implements ReaderImplementation {
  constructor(private geo: GeoService, private modals: ModalService) {}

  public async isSupported(files: AbcFile<Blob>[]): Promise<boolean> {
    return files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.XYZ_DEFINITION).length > 0;
  }

  public async read(files: AbcFile<Blob>[]): Promise<ReadResult> {
    const definitions = files.filter((f) => FileFormats.fromPath(f.path) === FileFormat.XYZ_DEFINITION);
    const layers: LayerWrapper[] = [];
    for (const file of definitions) {
      const fileContent = await BlobIO.asString(file.content);
      const definition = yaml.load(fileContent) as XyzDefinitionManifest | undefined;
      if (!definition || !definition.xyz.url) {
        return Promise.reject(new Error(`Invalid XYZ definition: ${JSON.stringify(definition)}`));
      }

      // We load projection if any
      if (definition.xyz.projection?.name) {
        await this.geo.loadProjection(definition.xyz.projection?.name);
      }

      // We prompt variables if needed
      let variables: VariableMap = {};
      if (definition.xyz.prompt) {
        const result = await this.modals.promptVariables(t('Further_information'), t('You_must_full_in_this_form'), definition.xyz.prompt);
        if (result.status === ModalStatus.Canceled) {
          return { status: ReadStatus.Canceled };
        }
        variables = result.variables;
      }

      // We create layer
      const url = variableExpansion(definition.xyz.url, variables);
      layers.push(LayerFactory.newXyzLayer(url, definition.xyz.projection));
    }

    return { status: ReadStatus.Succeed, layers };
  }
}
