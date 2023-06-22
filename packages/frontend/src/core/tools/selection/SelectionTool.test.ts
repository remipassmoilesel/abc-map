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

import { Map } from 'ol';
import * as sinon from 'sinon';
import { SinonStubbedInstance } from 'sinon';
import { HistoryService } from '../../history/HistoryService';
import { MainStore, storeFactory } from '../../store/store';
import VectorSource from 'ol/source/Vector';
import { TestHelper } from '../../utils/test/TestHelper';
import { SelectionTool } from './SelectionTool';

describe('SelectionTool', () => {
  let history: SinonStubbedInstance<HistoryService>;
  let store: MainStore;
  let map: Map;
  let source: VectorSource;
  let tool: SelectionTool;

  beforeEach(() => {
    store = storeFactory();
    history = sinon.createStubInstance(HistoryService);
    map = new Map();
    map.getInteractions().clear();

    source = new VectorSource();
    tool = new SelectionTool(store, history);
  });

  it('setup()', () => {
    tool.setup(map, source);

    expect(TestHelper.interactionNames(map)).toEqual(['DragRotate', 'DragPan', 'PinchRotate', 'PinchZoom', 'MouseWheelZoom', 'DragBox', 'Translate']);
  });

  it('dispose()', () => {
    tool.setup(map, source);
    tool.dispose();

    expect(TestHelper.interactionNames(map)).toEqual([]);
  });
});
