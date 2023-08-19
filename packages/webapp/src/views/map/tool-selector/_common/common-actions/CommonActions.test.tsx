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
import { newTestServices, TestServices } from '../../../../../core/utils/test/TestServices';
import { abcRender } from '../../../../../core/utils/test/abcRender';
import CommonActions from './CommonActions';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LayerFactory } from '../../../../../core/geo/layers/LayerFactory';
import { MapFactory } from '../../../../../core/geo/map/MapFactory';
import { FeatureWrapper } from '../../../../../core/geo/features/FeatureWrapper';
import { LineString, Point, Polygon } from 'ol/geom';
import { MapWrapper } from '../../../../../core/geo/map/MapWrapper';
import { VectorLayerWrapper } from '../../../../../core/geo/layers/LayerWrapper';
import { FillPatterns } from '@abc-map/shared';
import { MainState } from '../../../../../core/store/reducer';
import { IconName } from '../../../../../assets/point-icons/IconName';
import { TestHelper } from '../../../../../core/utils/test/TestHelper';

describe('CommonActions', () => {
  let fPoint: FeatureWrapper;
  let fLine: FeatureWrapper;
  let fPolygon: FeatureWrapper;
  let layer: VectorLayerWrapper;
  let map: MapWrapper;
  let state: MainState;
  let services: TestServices;

  beforeEach(() => {
    layer = LayerFactory.newVectorLayer();
    map = MapFactory.createNaked();
    map.addLayer(layer);
    map.setActiveLayer(layer);

    fPoint = FeatureWrapper.create(new Point([1, 1]));
    fLine = FeatureWrapper.create(new LineString([2, 2, 3, 3]));
    fPolygon = FeatureWrapper.create(
      new Polygon([
        [
          [2, 2],
          [3, 3],
          [2, 2],
        ],
      ])
    );

    map.getSelection().add([fPoint.unwrap()]);

    layer.getSource().addFeatures([fPoint.unwrap(), fLine.unwrap()]);

    state = {
      map: {
        currentStyle: {
          stroke: {
            color: '#FF5733',
            width: 5,
          },
          fill: {
            color1: '#FFFFFF',
            color2: '#FF5733',
            pattern: FillPatterns.Flat,
          },
          point: {
            color: '#FF5733',
            icon: IconName.IconGeoAltFill,
            size: 30,
          },
          text: {
            color: '#FF5733',
            font: 'AbcCantarell',
            offsetX: 15,
            offsetY: 15,
            rotation: 0,
            size: 30,
          },
        },
      },
    } as any;

    services = newTestServices();
    services.geo.getMainMap.returns(map);
  });

  describe('Apply style', () => {
    it('on point with text', async () => {
      // Prepare
      abcRender(<CommonActions />, { services, state });
      fPoint.setText('Hey !');

      // Act
      await act(async () => {
        await userEvent.click(screen.getByTestId('apply-style'));
      });

      await TestHelper.wait(0); // We wait for overlay
      const style = services.geo.updateSelectedFeatures.args[0][0](fPoint.getStyleProperties(), fPoint);

      // Assert
      expect(style).toEqual({
        text: {
          value: 'Hey !',
          color: '#FF5733',
          font: 'AbcCantarell',
          offsetX: 15,
          offsetY: 15,
          rotation: 0,
          size: 30,
        },
        point: {
          color: '#FF5733',
          icon: 'twbs/geo-alt-fill.inline.svg',
          size: 30,
        },
        fill: {},
        stroke: {},
        zIndex: undefined,
      });
    });

    it('on point without text', async () => {
      // Prepare
      abcRender(<CommonActions />, { services, state });

      // Act
      await act(async () => {
        await userEvent.click(screen.getByTestId('apply-style'));
      });
      await TestHelper.wait(0); // We wait for overlay
      const style = services.geo.updateSelectedFeatures.args[0][0](fPoint.getStyleProperties(), fPoint);

      // Assert
      expect(style).toEqual({
        point: { color: '#FF5733', icon: 'twbs/geo-alt-fill.inline.svg', size: 30 },
        fill: {},
        stroke: {},
        text: {},
        zIndex: undefined,
      });
    });

    it('on line', async () => {
      // Prepare
      abcRender(<CommonActions />, { services, state });

      // Act
      await act(async () => {
        await userEvent.click(screen.getByTestId('apply-style'));
      });
      await TestHelper.wait(0); // We wait for overlay
      const style = services.geo.updateSelectedFeatures.args[0][0](fPoint.getStyleProperties(), fLine);

      // Assert
      expect(style).toEqual({
        stroke: { color: '#FF5733', width: 5 },
        fill: {},
        text: {},
        point: {},
      });
    });

    it('on polygon', async () => {
      // Prepare
      abcRender(<CommonActions />, { services, state });

      // Act
      await act(async () => {
        await userEvent.click(screen.getByTestId('apply-style'));
      });
      await TestHelper.wait(0); // We wait for overlay
      const style = services.geo.updateSelectedFeatures.args[0][0](fPoint.getStyleProperties(), fPolygon);

      // Assert
      expect(style).toEqual({
        stroke: { color: '#FF5733', width: 5 },
        fill: {
          color1: '#FFFFFF',
          color2: '#FF5733',
          pattern: FillPatterns.Flat,
        },
        text: {},
        point: {},
      });
    });
  });

  it('Duplicate selection', async () => {
    // Prepare
    abcRender(<CommonActions />, { services, state });

    const style = { ...fPoint.getStyleProperties(), zIndex: 5555 };
    fPoint.setStyleProperties(style);

    // Act
    await act(async () => {
      await userEvent.click(screen.getByTestId('duplicate-selection'));
    });
    await TestHelper.wait(0); // We wait for overlay

    // Assert
    const features = layer
      .getSource()
      .getFeatures()
      .map((f) => FeatureWrapper.from(f));
    expect(features.length).toEqual(3);
    expect(features[0]).toEqual(fPoint);
    expect(features[1]).toEqual(fLine);
    expect(features[2].getStyleProperties()).toEqual(style);
    expect((features[2].getGeometry() as Point).getCoordinates()).toEqual([1174051, -1174049]);

    expect(services.history.register.callCount).toEqual(1);
  });

  it('Delete features', async () => {
    // Prepare
    abcRender(<CommonActions />, { services, state });

    // Act
    await act(async () => {
      await userEvent.click(screen.getByTestId('delete-features'));
    });
    await TestHelper.wait(0); // We wait for overlay

    // Assert
    const features = layer
      .getSource()
      .getFeatures()
      .map((f) => FeatureWrapper.from(f));
    expect(features.length).toEqual(1);
    expect(features[0]).toEqual(fLine);

    expect(services.history.register.callCount).toEqual(1);
  });

  it('Move features behind', async () => {
    // Prepare
    abcRender(<CommonActions />, { services, state });

    fPoint.setStyleProperties({ ...fPoint.getStyleProperties(), zIndex: 5 });

    // Act
    await act(async () => {
      await userEvent.click(screen.getByTestId('move-features-behind'));
    });
    await TestHelper.wait(0); // We wait for overlay
    const style = services.geo.updateSelectedFeatures.args[0][0](fPoint.getStyleProperties(), fPoint);

    // Assert
    expect(style?.zIndex).toEqual(4);
  });

  it('Move features forward', async () => {
    // Prepare
    abcRender(<CommonActions />, { services });

    fPoint.setStyleProperties({ ...fPoint.getStyleProperties(), zIndex: 5 });

    // Act
    await act(async () => {
      await userEvent.click(screen.getByTestId('move-features-forward'));
    });
    await TestHelper.wait(0); // We wait for overlay
    const style = services.geo.updateSelectedFeatures.args[0][0](fPoint.getStyleProperties(), fPoint);

    // Assert
    expect(style?.zIndex).toEqual(6);
  });
});
