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

import type { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { Classification } from './index';
import { MapFactory } from '../../../core/geo/map/MapFactory';
import type { SinonStub } from 'sinon';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { createScript } from '../script-api/createScript';
import type { ScriptContext } from '../script-api/ScriptContext';
import type { VectorLayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import type { TestServices } from '../../../core/utils/test/TestServices';
import { newTestServices } from '../../../core/utils/test/TestServices';
import { FeatureWrapper } from '../../../core/geo/features/FeatureWrapper';
import { getScriptApi } from '../script-api/ScriptApi';
import sortBy from 'lodash/sortBy';
import { logger } from './data';
import { beforeEach, describe, expect, it } from 'vitest';

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
        const filePath = path.resolve(import.meta.dirname, 'data/' + url);
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

    const scriptContent = await Classification.codeSample();
    const script = createScript(scriptContent);

    const context: ScriptContext = {
      scriptApi: getScriptApi(testServices),
      log: logStub,
    };

    // Act
    await script(context);

    // Assert
    const layers = map.getLayers();
    expect(layers.length).toEqual(3);

    const updatedLayer = layers[layers.length - 1] as VectorLayerWrapper;
    expect(updatedLayer.isVector()).toBe(true);

    const featureStyles = updatedLayer
      .getSource()
      .getFeatures()
      .map((feature) => FeatureWrapper.from(feature).getStyleProperties());
    expect(featureStyles.length).toEqual(18);
    expect(sortBy(featureStyles, (v) => v.text?.value)).toMatchSnapshot();
  });
});
