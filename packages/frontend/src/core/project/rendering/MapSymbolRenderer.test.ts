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
import { MapSymbolRenderer } from './MapSymbolRenderer';
import { StyleFactory } from '../../geo/styles/StyleFactory';
import { TestHelper } from '../../utils/test/TestHelper';
import sinon, { SinonStub, SinonStubbedInstance } from 'sinon';
import CanvasImmediateRenderer from 'ol/render/canvas/Immediate';
import { CanvasRenderingContext2D } from 'canvas';
import { Point } from 'ol/geom';
import { Icon } from 'ol/style';
import ImageState from 'ol/ImageState';
import { AbcGeometryType } from '@abc-map/shared';

describe('MapSymbolRenderer', function () {
  let styleFactory: SinonStubbedInstance<StyleFactory>;
  let toContext: SinonStub;
  let vectorContext: SinonStubbedInstance<CanvasImmediateRenderer>;
  let canvas: HTMLCanvasElement;
  let renderer: MapSymbolRenderer;

  beforeEach(() => {
    styleFactory = sinon.createStubInstance(StyleFactory);
    toContext = sinon.stub();
    vectorContext = sinon.createStubInstance(CanvasImmediateRenderer);
    toContext.returns(vectorContext);
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;

    renderer = new MapSymbolRenderer(styleFactory as unknown as StyleFactory, toContext as any);
  });

  describe('renderSymbol()', () => {
    it('Point, image not loaded', async () => {
      // Prepare
      const style = StyleFactory.get().getForProperties(TestHelper.sampleStyleProperties(), AbcGeometryType.POINT);
      const imageStub = sinon.createStubInstance(Icon);
      style.setImage(imageStub);
      imageStub.getImageState.returns(ImageState.LOADING);

      // We simulate image loading
      setTimeout(() => {
        imageStub.listenImageChange.args[0][0]({} as any);
      }, 100);

      // Act
      await renderer.renderSymbol(style, AbcGeometryType.POINT, canvas, 1);

      // Assert
      expect(toContext.callCount).toEqual(1);
      expect(toContext.args[0][0]).toBeInstanceOf(CanvasRenderingContext2D);
      expect(toContext.args[0][1]).toEqual({ pixelRatio: 1, size: [800, 600] });

      expect(vectorContext.setStyle.callCount).toEqual(1);
      expect(vectorContext.setStyle.args[0][0]).toEqual(style);
      expect(vectorContext.drawPoint.callCount).toEqual(1);
      expect((vectorContext.drawPoint.args[0][0] as Point).getCoordinates()).toEqual([400, 300]);
      expect(imageStub.unlistenImageChange.callCount).toEqual(1);
    });

    it('Point, image loaded', async () => {
      // Prepare
      const style = StyleFactory.get().getForProperties(TestHelper.sampleStyleProperties(), AbcGeometryType.POINT);
      const imageStub = sinon.createStubInstance(Icon);
      style.setImage(imageStub);
      imageStub.getImageState.returns(ImageState.LOADED);

      // Act
      await renderer.renderSymbol(style, AbcGeometryType.POINT, canvas, 1);

      // Assert
      expect(toContext.callCount).toEqual(1);
      expect(toContext.args[0][0]).toBeInstanceOf(CanvasRenderingContext2D);
      expect(toContext.args[0][1]).toEqual({ pixelRatio: 1, size: [800, 600] });

      expect(vectorContext.setStyle.callCount).toEqual(1);
      expect(vectorContext.setStyle.args[0][0]).toEqual(style);
      expect(vectorContext.drawPoint.callCount).toEqual(1);
      expect((vectorContext.drawPoint.args[0][0] as Point).getCoordinates()).toEqual([400, 300]);
    });
  });
});
