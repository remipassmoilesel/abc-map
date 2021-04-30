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

import { MapKeyboardListener } from './MapKeyboardListener';
import * as sinon from 'sinon';
import { SinonStubbedInstance } from 'sinon';
import { HistoryService } from '../../../core/history/HistoryService';
import { GeoService } from '../../../core/geo/GeoService';
import { Services } from '../../../core/Services';
import { ToastService } from '../../../core/ui/ToastService';
import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import { LayerWrapper, VectorLayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import { FeatureWrapper } from '../../../core/geo/features/FeatureWrapper';
import VectorSource from 'ol/source/Vector';

describe('MapKeyboardListener', () => {
  let geo: SinonStubbedInstance<GeoService>;
  let history: SinonStubbedInstance<HistoryService>;
  let toasts: SinonStubbedInstance<ToastService>;
  let keyboardListener: MapKeyboardListener;

  beforeEach(() => {
    history = sinon.createStubInstance(HistoryService);
    geo = sinon.createStubInstance(GeoService);
    toasts = sinon.createStubInstance(ToastService);
    keyboardListener = new MapKeyboardListener(({ geo, history, toasts } as unknown) as Services);
    keyboardListener.initialize();
  });

  afterEach(() => {
    keyboardListener.destroy();
  });

  // Here we cannot dispatch event from child, it does not work in jsdom
  it('should do nothing if event is from a form element', () => {
    const input = document.createElement('input');
    const event1 = fakeEvent(input, 'z', true);
    const textarea = document.createElement('textarea');
    const event2 = fakeEvent(textarea, 'z', true);

    keyboardListener.handleKeyPress((event1 as unknown) as KeyboardEvent);
    keyboardListener.handleKeyPress((event2 as unknown) as KeyboardEvent);

    expect(event1.preventDefault.callCount).toEqual(0);
    expect(event1.stopPropagation.callCount).toEqual(0);
    expect(event2.preventDefault.callCount).toEqual(0);
    expect(event2.stopPropagation.callCount).toEqual(0);
    expect(history.canUndo.callCount).toEqual(0);
  });

  it('should not fail on unknown keys', () => {
    const input = document.createElement('input');
    const event = fakeEvent(input, 'v', true);

    keyboardListener.handleKeyPress((event as unknown) as KeyboardEvent);
  });

  it('should delete on Delete if features found', () => {
    // Prepare
    const event = new KeyboardEvent('keypress', { key: 'Delete' });
    const map = sinon.createStubInstance(MapWrapper);
    const vectorLayer = sinon.createStubInstance(LayerWrapper);
    const vectorSource = sinon.createStubInstance(VectorSource);
    geo.getMainMap.returns((map as unknown) as MapWrapper);
    map.getActiveVectorLayer.returns((vectorLayer as unknown) as VectorLayerWrapper);
    map.getSelectedFeatures.returns([FeatureWrapper.create()]);
    vectorLayer.getSource.returns(vectorSource);

    // Act
    document.body.dispatchEvent(event);

    expect(vectorSource.removeFeature.callCount).toEqual(1);
    expect(history.register.callCount).toEqual(1);
  });

  it('should not delete on Delete if features not found', () => {
    // Prepare
    const event = new KeyboardEvent('keypress', { key: 'Delete' });
    const map = sinon.createStubInstance(MapWrapper);
    const vectorLayer = sinon.createStubInstance(LayerWrapper);
    const vectorSource = sinon.createStubInstance(VectorSource);
    geo.getMainMap.returns((map as unknown) as MapWrapper);
    map.getActiveVectorLayer.returns((vectorLayer as unknown) as VectorLayerWrapper);
    map.getSelectedFeatures.returns([]);
    vectorLayer.getSource.returns(vectorSource);

    // Act
    document.body.dispatchEvent(event);

    expect(vectorSource.removeFeature.callCount).toEqual(0);
    expect(history.register.callCount).toEqual(0);
  });

  it('should undo on CTRL + Z', () => {
    const event = new KeyboardEvent('keypress', { ctrlKey: true, key: 'z' });
    history.canUndo.returns(true);
    history.undo.resolves();

    document.body.dispatchEvent(event);

    expect(history.canUndo.callCount).toEqual(1);
    expect(history.undo.callCount).toEqual(1);
  });

  it('should redo on CTRL + MAJ + Z', () => {
    const event = new KeyboardEvent('keypress', { ctrlKey: true, shiftKey: true, key: 'Z' });
    history.canRedo.returns(true);
    history.redo.resolves();

    document.body.dispatchEvent(event);

    expect(history.canRedo.callCount).toEqual(1);
    expect(history.redo.callCount).toEqual(1);
  });
});

function fakeEvent(target: Node, key: string, ctrlKey = false) {
  return {
    target,
    key,
    ctrlKey,
    preventDefault: sinon.stub(),
    stopPropagation: sinon.stub(),
  };
}
