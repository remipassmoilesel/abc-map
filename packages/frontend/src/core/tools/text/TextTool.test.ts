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
import { Map } from 'ol';
import VectorSource from 'ol/source/Vector';
import { TextTool } from './TextTool';
import { TestHelper } from '../../utils/test/TestHelper';

describe('Text', () => {
  it('setup()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = new Map({});
    const source = new VectorSource();

    const text = new TextTool(store, history);
    text.setup(map, source);

    expect(text.getMap()).toStrictEqual(map);
    expect(text.getSource()).toStrictEqual(source);
    const interactions = TestHelper.interactionNames(map);
    expect(interactions).toContain('TextInteraction');
  });

  it('dispose()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = new Map({});
    const source = new VectorSource();

    const text = new TextTool(store, history);
    text.setup(map, source);
    text.dispose();

    const interactions = TestHelper.interactionNames(map);
    expect(interactions).not.toContain('TextInteraction');
  });
});
