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

import { MainStore } from '../../store/store';
import { HistoryService } from '../../history/HistoryService';
import VectorSource from 'ol/source/Vector';
import { PolygonTool } from './PolygonTool';
import * as sinon from 'sinon';
import { MapFactory } from '../../geo/map/MapFactory';
import { Snap } from 'ol/interaction';
import { TestHelper } from '../../utils/TestHelper';

describe('PolygonTool', () => {
  it('setup()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = MapFactory.createNaked().unwrap();
    const source = new VectorSource();

    const tool = new PolygonTool(store, history);
    tool.setup(map, source);

    expect(TestHelper.interactionNames(map)).toEqual(['DoubleClickZoom', 'DragPan', 'KeyboardPan', 'MouseWheelZoom', 'Modify', 'Draw', 'Snap', 'Select']);
  });

  it('dispose()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = MapFactory.createNaked().unwrap();
    const source = new VectorSource();
    const factoryStub = sinon.stub();
    const disposeStub = sinon.stub();
    factoryStub.returns({ dispose: disposeStub, interactions: [new Snap({ source: new VectorSource() })] });

    const tool = new PolygonTool(store, history, factoryStub);
    tool.setup(map, source);
    tool.dispose();

    expect(TestHelper.interactionNames(map)).toEqual([]);
    expect(disposeStub.callCount).toEqual(1);
  });
});
