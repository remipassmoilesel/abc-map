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
import { newTestServices, TestServices } from '../../../../../core/utils/test/TestServices';
import { abcRender } from '../../../../../core/utils/test/abcRender';
import ButtonBar, { StyleApplication } from './ButtonBar';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LayerFactory } from '../../../../../core/geo/layers/LayerFactory';
import { MapFactory } from '../../../../../core/geo/map/MapFactory';
import { FeatureWrapper } from '../../../../../core/geo/features/FeatureWrapper';
import { LineString, Point, Polygon } from 'ol/geom';
import { MapWrapper } from '../../../../../core/geo/map/MapWrapper';
import { VectorLayerWrapper } from '../../../../../core/geo/layers/LayerWrapper';
import { FillPatterns } from '@abc-map/shared';

describe('ButtonBar', () => {
  let fPoint: FeatureWrapper;
  let fLine: FeatureWrapper;
  let fPolygon: FeatureWrapper;
  let layer: VectorLayerWrapper;
  let map: MapWrapper;
  let services: TestServices;

  beforeEach(() => {
    layer = LayerFactory.newVectorLayer();
    map = MapFactory.createNaked();
    map.addLayer(layer);
    map.setActiveLayer(layer);

    fPoint = FeatureWrapper.create(new Point([1, 1])).setSelected(true);
    fLine = FeatureWrapper.create(new LineString([2, 2, 3, 3])).setSelected(false);
    fPolygon = FeatureWrapper.create(
      new Polygon([
        [
          [2, 2],
          [3, 3],
          [2, 2],
        ],
      ])
    ).setSelected(false);
    layer.getSource().addFeatures([fPoint.unwrap(), fLine.unwrap()]);

    services = newTestServices();
    services.geo.getMainMap.returns(map);
  });

  describe('Apply style', () => {
    it('with StyleApplication.Text', () => {
      // Prepare
      abcRender(<ButtonBar applyStyle={StyleApplication.Text} />, { services });
      fPoint.setText('Hey !');

      // Act
      userEvent.click(screen.getByTestId('apply-style'));
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
        point: {},
        fill: {},
        stroke: {},
        zIndex: undefined,
      });
    });

    it('with StyleApplication.Point', () => {
      // Prepare
      abcRender(<ButtonBar applyStyle={StyleApplication.Point} />, { services });

      // Act
      userEvent.click(screen.getByTestId('apply-style'));
      const style1 = services.geo.updateSelectedFeatures.args[0][0](fPoint.getStyleProperties(), fPoint);
      const style2 = services.geo.updateSelectedFeatures.args[0][0](fPoint.getStyleProperties(), fLine);

      // Assert
      expect(style1).toEqual({
        point: { color: '#FF5733', icon: 'twbs/geo-alt-fill.inline.svg', size: 30 },
        fill: {},
        stroke: {},
        text: {},
        zIndex: undefined,
      });

      expect(style2).toBeUndefined();
    });

    it('with StyleApplication.Line', () => {
      // Prepare
      abcRender(<ButtonBar applyStyle={StyleApplication.Line} />, { services });

      // Act
      userEvent.click(screen.getByTestId('apply-style'));
      const style1 = services.geo.updateSelectedFeatures.args[0][0](fPoint.getStyleProperties(), fLine);
      const style2 = services.geo.updateSelectedFeatures.args[0][0](fPoint.getStyleProperties(), fPoint);

      // Assert
      expect(style1).toEqual({
        stroke: { color: '#FF5733', width: 5 },
        fill: {},
        text: {},
        point: {},
      });

      expect(style2).toBeUndefined();
    });

    it('with StyleApplication.Polygon', () => {
      // Prepare
      abcRender(<ButtonBar applyStyle={StyleApplication.Polygon} />, { services });

      // Act
      userEvent.click(screen.getByTestId('apply-style'));
      const style1 = services.geo.updateSelectedFeatures.args[0][0](fPoint.getStyleProperties(), fPolygon);
      const style2 = services.geo.updateSelectedFeatures.args[0][0](fPoint.getStyleProperties(), fPoint);

      // Assert
      expect(style1).toEqual({
        stroke: { color: '#FF5733', width: 5 },
        fill: {
          color1: '#FFFFFF',
          color2: '#FF5733',
          pattern: FillPatterns.Flat,
        },
        text: {},
        point: {},
      });

      expect(style2).toBeUndefined();
    });

    it('with StyleApplication.All', () => {
      // Prepare
      abcRender(<ButtonBar applyStyle={StyleApplication.All} />, { services });
      fPoint.setText('Hey !');

      // Act
      userEvent.click(screen.getByTestId('apply-style'));
      const style1 = services.geo.updateSelectedFeatures.args[0][0](fPoint.getStyleProperties(), fPoint);
      const style2 = services.geo.updateSelectedFeatures.args[0][0](fLine.getStyleProperties(), fLine);

      // Assert
      expect(style1).toEqual({
        point: { color: '#FF5733', icon: 'twbs/geo-alt-fill.inline.svg', size: 30 },
        text: {
          value: 'Hey !',
          color: '#FF5733',
          font: 'AbcCantarell',
          offsetX: 15,
          offsetY: 15,
          rotation: 0,
          size: 30,
        },
        fill: {},
        stroke: {},
        zIndex: undefined,
      });

      expect(style2).toEqual({
        stroke: { color: '#FF5733', width: 5 },
        text: {
          color: '#FF5733',
          font: 'AbcCantarell',
          offsetX: 15,
          offsetY: 15,
          rotation: 0,
          size: 30,
        },
        point: {},
        fill: {},
        zIndex: undefined,
      });
    });
  });

  it('Duplicate selection', () => {
    // Prepare
    abcRender(<ButtonBar applyStyle={StyleApplication.All} />, { services });

    const style = { ...fPoint.getStyleProperties(), zIndex: 5555 };
    fPoint.setStyleProperties(style);

    // Act
    userEvent.click(screen.getByTestId('duplicate-selection'));

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

  it('Delete features', () => {
    // Prepare
    abcRender(<ButtonBar applyStyle={StyleApplication.All} />, { services });

    // Act
    userEvent.click(screen.getByTestId('delete-features'));

    // Assert
    const features = layer
      .getSource()
      .getFeatures()
      .map((f) => FeatureWrapper.from(f));
    expect(features.length).toEqual(1);
    expect(features[0]).toEqual(fLine);

    expect(services.history.register.callCount).toEqual(1);
  });

  it('Move features behind', () => {
    // Prepare
    abcRender(<ButtonBar applyStyle={StyleApplication.All} />, { services });

    fPoint.setStyleProperties({ ...fPoint.getStyleProperties(), zIndex: 5 });

    // Act
    userEvent.click(screen.getByTestId('move-features-behind'));
    const style = services.geo.updateSelectedFeatures.args[0][0](fPoint.getStyleProperties(), fPoint);

    // Assert
    expect(style?.zIndex).toEqual(4);
  });

  it('Move features forward', () => {
    // Prepare
    abcRender(<ButtonBar applyStyle={StyleApplication.All} />, { services });

    fPoint.setStyleProperties({ ...fPoint.getStyleProperties(), zIndex: 5 });

    // Act
    userEvent.click(screen.getByTestId('move-features-forward'));
    const style = services.geo.updateSelectedFeatures.args[0][0](fPoint.getStyleProperties(), fPoint);

    // Assert
    expect(style?.zIndex).toEqual(6);
  });
});
