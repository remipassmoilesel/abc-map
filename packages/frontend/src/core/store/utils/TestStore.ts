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

import sinon, { SinonStub } from 'sinon';
import { MainState } from '../reducer';

export interface TestStore {
  subscribe: SinonStub<[() => void], Function>;
  dispatch: SinonStub<[any], void>;
  getState: SinonStub<[], MainState>;
  _unsubscribe: SinonStub<[], void>;
}

export function newTestStore(): TestStore {
  const _unsubscribe = sinon.stub<[], void>();

  const subscribe = sinon.stub<[() => void], Function>();
  subscribe.returns(_unsubscribe);

  return {
    subscribe,
    dispatch: sinon.stub(),
    getState: sinon.stub(),
    _unsubscribe,
  };
}
