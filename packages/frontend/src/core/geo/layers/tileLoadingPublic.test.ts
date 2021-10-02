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

import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { ImageTile, Tile, VectorTile } from 'ol';
import TileState from 'ol/TileState';
import { waitFor } from '@testing-library/react';
import { AxiosInstance } from 'axios';
import { HttpClientFactory, logger, tileLoadingPublic } from './tileLoadingPublic';

logger.disable();

describe('tileLoadingPublic', () => {
  let getStub: SinonStub;
  let fakeClient: AxiosInstance;
  let factoryStub: SinonStub;

  beforeEach(() => {
    getStub = sinon.stub();
    fakeClient = { get: getStub } as unknown as AxiosInstance;

    factoryStub = sinon.stub();
    factoryStub.returns(fakeClient);

    global.URL.createObjectURL = jest.fn(() => 'http://test-object-url');
  });

  it('loadTile() should set image attributes', async () => {
    // Prepare
    getStub.resolves(Promise.resolve({}));

    const tileStub = sinon.createStubInstance(ImageTile);
    const tileImage = document.createElement('img');
    tileStub.getImage.returns(tileImage);

    const loadTile = tileLoadingPublic(factoryStub as unknown as HttpClientFactory);

    // Act
    loadTile(tileStub as unknown as Tile, 'http://test-url');

    // Assert
    await waitFor(() => {
      expect(getStub.args).toEqual([['http://test-url']]);
      expect(tileImage.getAttribute('src')).toEqual('http://test-object-url');
      expect(tileImage.getAttribute('crossorigin')).toEqual('Anonymous');
    });
  });

  it('loadTile() should set status as error if request fail', async () => {
    // Prepare
    getStub.resolves(Promise.reject(new Error('Test error')));
    const tileStub = sinon.createStubInstance(ImageTile);
    const loadTile = tileLoadingPublic(factoryStub as unknown as HttpClientFactory);

    // Act
    loadTile(tileStub as unknown as Tile, 'http://test-url');

    // Assert
    await waitFor(() => {
      expect(getStub.callCount).toEqual(1);
      expect(tileStub.setState.args).toEqual([[TileState.ERROR]]);
    });
  });

  it('loadTile() should set status as error if tile is not supported', async () => {
    // Prepare
    getStub.resolves(Promise.resolve({}));
    const tileStub = sinon.createStubInstance(VectorTile);
    const loadTile = tileLoadingPublic(factoryStub as unknown as HttpClientFactory);

    // Act
    loadTile(tileStub as unknown as Tile, 'http://test-url');

    // Assert
    await waitFor(() => {
      expect(tileStub.setState.callCount).toEqual(1);
      expect(tileStub.setState.getCalls()[0].args).toEqual([TileState.ERROR]);
    });
  });
});
