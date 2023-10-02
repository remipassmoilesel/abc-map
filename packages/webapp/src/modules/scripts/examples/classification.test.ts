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

import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { Classification } from './index';
import { MapFactory } from '../../../core/geo/map/MapFactory';
import sinon, { SinonStub } from 'sinon';
import * as fs from 'fs';
import * as path from 'path';
import { createScript } from '../script-api/createScript';
import { ScriptContext } from '../script-api/ScriptContext';
import { getModuleApi } from '../../../core/modules/registry/getModuleApi';
import { VectorLayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import { newTestServices, TestServices } from '../../../core/utils/test/TestServices';
import { FeatureWrapper } from '../../../core/geo/features/FeatureWrapper';
import { getScriptApi } from '../script-api/ScriptApi';
import sortBy from 'lodash/sortBy';
import { logger } from './data';

logger.disable();

describe('classification.js-txt', () => {
  let logStub: sinon.SinonStub;
  let map: MapWrapper;
  let testServices: TestServices;

  beforeEach(async () => {
    logStub = sinon.stub();
    map = MapFactory.createDefault();

    testServices = newTestServices();
    testServices.geo.getMainMap.returns(map);

    (fetch as SinonStub).callsFake(async function (url: string | undefined) {
      if (url?.endsWith('.geojson')) {
        const filePath = path.resolve(__dirname, 'data/' + url);
        return fs.promises.readFile(filePath).then((res) => ({ json: async () => res.toString('utf-8') }));
      }
    });
  });

  it('setup should work', async () => {
    await Classification.setup(map);

    const layerNames = map.getLayers().map((layer) => layer.getName());
    expect(layerNames).toMatchSnapshot();
  });

  it('example should work', async () => {
    // Prepare
    await Classification.setup(map);

    const scriptContent = await fs.promises.readFile(path.resolve(__dirname, Classification.codeUrl));
    const script = createScript(scriptContent.toString('utf-8'));

    const context: ScriptContext = {
      moduleApi: getModuleApi(testServices),
      scriptApi: getScriptApi(testServices),
      log: logStub,
    };

    // Act
    await script(context);

    // Assert
    const layers = map.getLayers();
    const updatedLayer = layers[layers.length - 1] as VectorLayerWrapper;
    expect(updatedLayer.isVector()).toBe(true);

    const featureStyles = updatedLayer
      .getSource()
      .getFeatures()
      .map((feature) => FeatureWrapper.from(feature).getStyleProperties());
    expect(sortBy(featureStyles, (v) => v.text?.value)).toMatchSnapshot();
  });
});
