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

import { LayerFactory } from '../../../core/geo/layers/LayerFactory';
import Feature from 'ol/Feature';
import { exportLayer } from './exportLayer';
import { Format } from './Format';
import { AbcProjection, BlobIO } from '@abc-map/shared';
import { GeoJSON } from 'ol/format';

describe('exportLayer()', () => {
  const sourceProjection: AbcProjection = { name: 'EPSG:3857' };

  it('GeoJSON', async () => {
    // Prepare
    const layer = LayerFactory.newVectorLayer();
    layer.getSource().addFeatures(testFeatures());

    // Act
    const exported = await exportLayer(layer, sourceProjection, Format.GeoJSON);

    // Assert
    expect(exported).toHaveLength(1);

    const content = await BlobIO.asString(exported[0].content);
    expect(JSON.parse(content)).toMatchSnapshot();
  });

  it('GPX', async () => {
    // Prepare
    const layer = LayerFactory.newVectorLayer();
    layer.getSource().addFeatures(testFeatures());

    // Act
    const exported = await exportLayer(layer, sourceProjection, Format.GPX);

    // Assert
    expect(exported).toHaveLength(1);

    const content = await BlobIO.asString(exported[0].content);
    expect(content).toMatchSnapshot();
  });

  it('KML', async () => {
    // Prepare
    const layer = LayerFactory.newVectorLayer();
    layer.getSource().addFeatures(testFeatures());

    // Act
    const exported = await exportLayer(layer, sourceProjection, Format.KML);

    // Assert
    expect(exported).toHaveLength(1);

    const content = await BlobIO.asString(exported[0].content);
    expect(content).toMatchSnapshot();
  });

  it('WKT', async () => {
    // Prepare
    const layer = LayerFactory.newVectorLayer();
    layer.getSource().addFeatures(testFeatures());

    // Act
    const exported = await exportLayer(layer, sourceProjection, Format.WKT);

    // Assert
    expect(exported).toHaveLength(1);

    const content = await BlobIO.asString(exported[0].content);
    expect(content).toMatchSnapshot();
  });

  /**
   * Return a set of features for testing purposes.
   *
   * We use EPSG:3857 as source projection because it is the default projection used.
   */
  function testFeatures(): Feature[] {
    const geojson = new GeoJSON();
    return geojson.readFeatures(
      {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-5373603.704493113, 5400461.011186721],
            },
            properties: {
              'abc:style:point:icon': 'twbs/geo-alt-fill.inline.svg',
              'abc:style:point:size': 90,
              'abc:style:point:color': 'rgba(18,90,147,0.9)',
              'abc:feature:selected': false,
            },
            id: 'inzkwakyyX',
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-5037755.981993113, 2794282.6845867215],
            },
            properties: {
              'abc:style:point:icon': 'twbs/geo-alt-fill.inline.svg',
              'abc:style:point:size': 90,
              'abc:style:point:color': 'rgba(18,90,147,0.9)',
              'abc:feature:selected': false,
            },
            id: 'Ek3C9txfoI',
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-3197310.462693112, -53706.002213278785],
            },
            properties: {
              'abc:style:point:icon': 'twbs/geo-alt-fill.inline.svg',
              'abc:style:point:size': 90,
              'abc:style:point:color': 'rgba(18,90,147,0.9)',
              'abc:feature:selected': false,
            },
            id: 'h5Lft_xAG9',
          },
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [-3506290.367393112, 6018420.820586721],
                [-3573459.9118931126, 2740547.048986722],
                [-1733014.3925931118, 362745.17368672136],
              ],
            },
            properties: {
              'abc:style:stroke:color': 'rgba(18,90,147,0.60)',
              'abc:style:stroke:width': 3,
              'abc:feature:selected': false,
            },
            id: 'nzIpj1HQr3',
          },
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [-1612109.2124931123, 2989074.3636367214],
                [-1209091.9454931132, 772479.3951367214],
                [-1289695.3988931123, -1309776.4843632793],
              ],
            },
            properties: {
              'abc:style:stroke:color': 'rgba(18,90,147,0.60)',
              'abc:style:stroke:width': 3,
              'abc:feature:selected': false,
            },
            id: '5OdMTSrfAR',
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [-2995801.8291931134, -2290451.8340632785],
                  [604485.7560068872, -1591888.5712632798],
                  [685089.2094068881, -3365164.5460632797],
                  [-2995801.8291931134, -2290451.8340632785],
                ],
              ],
            },
            properties: {
              'abc:style:stroke:color': 'rgba(18,90,147,0.60)',
              'abc:style:stroke:width': 3,
              'abc:style:fill:color1': 'rgba(18,90,147,0.30)',
              'abc:style:fill:color2': 'rgba(255,255,255,0.60)',
              'abc:style:fill:pattern': 'abc:style:fill:hatching:oblique:right',
              'abc:feature:selected': true,
            },
            id: 'pCEluZ7j--',
          },
        ],
      },
      { dataProjection: sourceProjection.name, featureProjection: sourceProjection.name }
    );
  }
});
