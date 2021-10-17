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
import ButtonBar from './ButtonBar';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LayerFactory } from '../../../../../core/geo/layers/LayerFactory';
import { MapFactory } from '../../../../../core/geo/map/MapFactory';
import { FeatureWrapper } from '../../../../../core/geo/features/FeatureWrapper';
import { Point } from 'ol/geom';
import { MapWrapper } from '../../../../../core/geo/map/MapWrapper';
import { VectorLayerWrapper } from '../../../../../core/geo/layers/LayerWrapper';

describe('ButtonBar', () => {
  let f1: FeatureWrapper;
  let f2: FeatureWrapper;
  let layer: VectorLayerWrapper;
  let map: MapWrapper;
  let services: TestServices;

  beforeEach(() => {
    layer = LayerFactory.newVectorLayer();
    map = MapFactory.createNaked();
    map.addLayer(layer);
    map.setActiveLayer(layer);

    f1 = FeatureWrapper.create(new Point([1, 1])).setSelected(true);
    f2 = FeatureWrapper.create(new Point([2, 2])).setSelected(false);
    layer.getSource().addFeatures([f1.unwrap(), f2.unwrap()]);

    services = newTestServices();
    services.geo.getMainMap.returns(map);
  });

  describe('Apply style', () => {
    it('with Point', () => {
      // Prepare
      abcRender(<ButtonBar />, { services });

      // Act
      userEvent.click(screen.getByTestId('apply-style'));
      const style = services.geo.updateSelectedFeatures.args[0][0](f1.getStyleProperties(), f1);

      expect(style).toEqual({
        point: { color: '#FF5733', icon: 'twbs/geo-alt-fill.inline.svg', size: 30 },
        fill: { color1: undefined, color2: undefined, pattern: undefined },
        stroke: { color: undefined, width: undefined },
        text: { alignment: undefined, color: undefined, font: undefined, offsetX: undefined, offsetY: undefined, size: undefined, value: undefined },
        zIndex: undefined,
      });
    });
  });

  it('Duplicate selection', () => {
    // Prepare
    abcRender(<ButtonBar />, { services });

    const style = { ...f1.getStyleProperties(), zIndex: 5555 };
    f1.setStyleProperties(style);

    // Act
    userEvent.click(screen.getByTestId('duplicate-selection'));

    // Assert
    const features = layer
      .getSource()
      .getFeatures()
      .map((f) => FeatureWrapper.from(f));
    expect(features.length).toEqual(3);
    expect(features[0]).toEqual(f1);
    expect(features[1]).toEqual(f2);
    expect(features[2].getStyleProperties()).toEqual(style);
    expect((features[2].getGeometry() as Point).getCoordinates()).toEqual([1174051, -1174049]);

    expect(services.history.register.callCount).toEqual(1);
  });

  it('Delete features', () => {
    // Prepare
    abcRender(<ButtonBar />, { services });

    // Act
    userEvent.click(screen.getByTestId('delete-features'));

    // Assert
    const features = layer
      .getSource()
      .getFeatures()
      .map((f) => FeatureWrapper.from(f));
    expect(features.length).toEqual(1);
    expect(features[0]).toEqual(f2);

    expect(services.history.register.callCount).toEqual(1);
  });

  it('Move features behind', () => {
    // Prepare
    abcRender(<ButtonBar />, { services });

    f1.setStyleProperties({ ...f1.getStyleProperties(), zIndex: 5 });

    // Act
    userEvent.click(screen.getByTestId('move-features-behind'));
    const style = services.geo.updateSelectedFeatures.args[0][0](f1.getStyleProperties(), f1);

    // Assert
    expect(style?.zIndex).toEqual(4);
  });

  it('Move features forward', () => {
    // Prepare
    abcRender(<ButtonBar />, { services });

    f1.setStyleProperties({ ...f1.getStyleProperties(), zIndex: 5 });

    // Act
    userEvent.click(screen.getByTestId('move-features-forward'));
    const style = services.geo.updateSelectedFeatures.args[0][0](f1.getStyleProperties(), f1);

    // Assert
    expect(style?.zIndex).toEqual(6);
  });
});
