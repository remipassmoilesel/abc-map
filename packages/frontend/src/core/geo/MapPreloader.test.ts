/**
 * Copyright © 2022 Rémi Pace.
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

import sinon, { SinonStub, SinonStubbedInstance } from 'sinon';
import { MapWrapper } from './map/MapWrapper';
import Map from 'ol/Map';
import View from 'ol/View';
import { logger, MapPreloader, PreloadEvent } from './MapPreloader';
import { TestHelper } from '../utils/test/TestHelper';

logger.disable();

describe('MapPreloader', () => {
  let sourceMap: SinonStubbedInstance<MapWrapper>;
  let sourceOlMap: SinonStubbedInstance<Map>;
  let sourceView: SinonStubbedInstance<View>;

  let renderingMap: SinonStubbedInstance<MapWrapper>;
  let renderingOlMap: SinonStubbedInstance<Map>;
  let renderingView: SinonStubbedInstance<View>;

  let eventListener: SinonStub<[CustomEvent<PreloadEvent>], void>;
  let preloader: MapPreloader;

  beforeEach(() => {
    sourceMap = sinon.createStubInstance(MapWrapper);
    sourceOlMap = sinon.createStubInstance(Map);
    sourceView = sinon.createStubInstance(View);
    sourceMap.unwrap.returns(sourceOlMap);
    sourceOlMap.getView.returns(sourceView);
    sourceMap.render.rejects(new Error('Source map should not be rendered'));
    sourceView.setCenter.throws(new Error('Source map is readonly'));
    sourceView.setZoom.throws(new Error('Source map is readonly'));

    renderingMap = sinon.createStubInstance(MapWrapper);
    renderingOlMap = sinon.createStubInstance(Map);
    renderingView = sinon.createStubInstance(View);
    renderingMap.unwrap.returns(renderingOlMap);
    renderingOlMap.getView.returns(renderingView);

    renderingMap.render.resolves();

    eventListener = sinon.stub();
    preloader = new MapPreloader();
    preloader.addEventListener(eventListener);

    preloader.init();
    preloader.setRenderingMap(renderingMap);
  });

  it('should dispatch events', async () => {
    // Prepare
    sourceView.getZoom.returns(5);
    sourceView.calculateExtent.returns([100, 100, 200, 200]);
    renderingView.calculateExtent.returns([100, 100, 150, 150]);

    // Act
    await preloader.load(sourceMap, 3);
    await TestHelper.wait(100);

    // Assert
    const events = eventListener.args.flatMap((args) => args).map((ev) => ev.detail);
    expect(events).toEqual([
      { value: 0 },
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
      { value: 6 },
      { value: 7 },
      { value: 8 },
      { value: 33 },
      { value: 33 },
      { value: 34 },
      { value: 35 },
      { value: 36 },
      { value: 37 },
      { value: 38 },
      { value: 39 },
      { value: 40 },
      { value: 41 },
      { value: 66 },
      { value: 66 },
      { value: 67 },
      { value: 68 },
      { value: 69 },
      { value: 70 },
      { value: 71 },
      { value: 72 },
      { value: 73 },
      { value: 74 },
      { value: 99 },
      { value: 100 },
    ]);
  });

  it('should set rendering view correctly', async () => {
    sourceView.getZoom.returns(5);
    sourceView.calculateExtent.returns([-50, 100, 50, 200]); // Side of 100
    renderingView.calculateExtent.onCall(0).returns([-100, 50, 0, 150]); // Side of 100
    renderingView.calculateExtent.onCall(1).returns([-25, 75, 25, 125]); // Side of 50
    renderingView.calculateExtent.onCall(2).returns([-65, 90, -40, 115]); // Side of 25

    // Act
    const { promise } = preloader.load(sourceMap, 3);
    await promise;

    // Assert
    expect(renderingView.setCenter.args).toEqual(
      /* eslint-disable prettier/prettier */
      [
        // Step 1
        [[-50, 100]],
        [[-50, 100]], [[50, 100]],
        [[-50, 200]], [[50, 200]],

        // Step 2
        [[-50, 100]],
        [[-50, 100]], [[0, 100]], [[50, 100]],
        [[-50, 150]], [[0, 150]], [[50, 150]],
        [[-50, 200]], [[0, 200]], [[50, 200]],

        // Step 3
        [[-50, 100]],
        [[-50, 100]], [[-25, 100]], [[0, 100]], [[25, 100]], [[50, 100]],
        [[-50, 125]], [[-25, 125]], [[0, 125]], [[25, 125]], [[50, 125]],
        [[-50, 150]], [[-25, 150]], [[0, 150]], [[25, 150]], [[50, 150]],
        [[-50, 175]], [[-25, 175]], [[0, 175]], [[25, 175]], [[50, 175]],
        [[-50, 200]], [[-25, 200]], [[0, 200]], [[25, 200]], [[50, 200]],
      ]
      /* eslint-enable prettier/prettier */
    );

    expect(renderingView.setZoom.args).toEqual(
      /* eslint-disable prettier/prettier */
      [
        // Step 1
        [5],
        [5], [5],
        [5], [5],
        // Step 2
        [6],
        [6], [6], [6],
        [6], [6], [6],
        [6], [6], [6],
        // Step 3
        [7],
        [7], [7], [7], [7], [7],
        [7], [7], [7], [7], [7],
        [7], [7], [7], [7], [7],
        [7], [7], [7], [7], [7],
        [7], [7], [7], [7], [7],
      ]
      /* eslint-enable prettier/prettier */
    );
  });

  it('should cancel', async () => {
    // Prepare
    sourceView.getZoom.returns(5);
    sourceView.calculateExtent.returns([-50, 100, 50, 200]); // Side of 100
    renderingView.calculateExtent.onCall(0).returns([-100, 50, 0, 150]); // Side of 100
    renderingView.calculateExtent.onCall(1).returns([-25, 75, 25, 125]); // Side of 50
    renderingView.calculateExtent.onCall(2).returns([-65, 90, -40, 115]); // Side of 25

    // We call cancel on 20th call
    let cancelFunc: (() => void) | undefined = undefined;
    eventListener.onCall(20).callsFake(() => cancelFunc && cancelFunc());

    // Act
    const { promise, cancel } = preloader.load(sourceMap, 3);
    cancelFunc = cancel;
    await promise;

    // Assert
    expect(eventListener.args.length).toEqual(22);
  });
});
