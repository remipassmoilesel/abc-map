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
import { LayoutRenderer } from './LayoutRenderer';
import { TestHelper } from '../utils/test/TestHelper';
import { AbcLegend, LegendDisplay } from '@abc-map/shared';
import { MapFactory } from '../geo/map/MapFactory';
import { LayerFactory } from '../geo/layers/LayerFactory';
import { FeatureWrapper } from '../geo/features/FeatureWrapper';
import { Point } from 'ol/geom';
import { MapWrapper } from '../geo/map/MapWrapper';

// TODO: finish test
// TODO: use all vector shapes
// TODO: use all styles available
// TODO: use mocked XYZ layer
// TODO: use mocked WMS layer

describe('LayoutRenderer', () => {
  let renderer: LayoutRenderer;
  let sourceSupport: HTMLDivElement;
  let exportSupport: HTMLDivElement;
  let sourceMap: MapWrapper;
  const width = 800;
  const height = 600;

  beforeEach(() => {
    renderer = new LayoutRenderer();
    sourceSupport = createSupport();
    exportSupport = createSupport();

    renderer.init(exportSupport);

    sourceMap = MapFactory.createNaked();
    sourceMap.setTarget(sourceSupport);
    sourceMap.unwrap().setSize([width, height]);
  });

  it('should render', async () => {
    const layout = TestHelper.sampleLayout();
    const legend: AbcLegend = {
      display: LegendDisplay.Hidden,
      items: [],
      width: 100,
      height: 100,
    };
    const layer = LayerFactory.newVectorLayer();
    layer.getSource().addFeature(FeatureWrapper.create(new Point([37.41, 8.82])).unwrap());
    sourceMap.addLayer(layer);

    await TestHelper.renderMap(sourceMap.unwrap());

    const result = await renderer.renderLayoutsAsPdf([layout], legend, sourceMap);
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Blob);
  });
});

function createSupport(): HTMLDivElement {
  const target = document.createElement('div');
  const style = target.style;
  style.position = 'absolute';
  style.left = '0px';
  style.top = '0px';
  style.width = `800px`;
  style.height = `600px`;
  document.body.appendChild(target);

  return target;
}
