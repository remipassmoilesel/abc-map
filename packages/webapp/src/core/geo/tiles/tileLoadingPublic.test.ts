/**
 * Copyright © 2026 Rémi Pace.
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

import type { SinonStub, SinonStubbedInstance } from 'sinon';
import sinon from 'sinon';
import type { AxiosInstance } from 'axios';
import axios from 'axios';
import ImageTile from 'ol/ImageTile';
import type { LoadFunction } from 'ol/Tile';
import VectorTile from 'ol/VectorTile';
import TileState from 'ol/TileState';
import { waitFor } from '@testing-library/react';
import { logger, tileLoadingPublic } from './tileLoadingPublic';
import { TileStorage } from '../../storage/indexed-db/tiles/TileIDBStorage';
import { TestHelper } from '../../utils/test/TestHelper';
import { disableTileImageLogging } from './setTileImage';
import { CURRENT_VERSION } from '../../storage/indexed-db/tiles/TileIDBEntry';
import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('axios');
vi.mock('../../storage/indexed-db/tiles/TileIDBStorage');

logger.disable();
disableTileImageLogging();

describe('tileLoadingPublic', () => {
  const createObjectUrlStub = URL.createObjectURL as SinonStub;
  let httpGetStub: SinonStub;
  let storage: SinonStubbedInstance<TileStorage>;
  let tileStub: SinonStubbedInstance<ImageTile>;
  let loadTile: LoadFunction;

  beforeEach(() => {
    httpGetStub = sinon.stub();
    const fakeClient = { get: httpGetStub } as unknown as AxiosInstance;
    (axios.create as Mock<any>).mockImplementation(() => fakeClient);

    storage = sinon.createStubInstance(TileStorage);
    (TileStorage.get as Mock<any>).mockImplementation(() => storage);

    tileStub = sinon.createStubInstance(ImageTile);
    const tileImage = document.createElement('img');
    tileStub.getImage.returns(tileImage);

    createObjectUrlStub.returns('http://test-object-url');

    loadTile = tileLoadingPublic();
  });

  afterEach(() => {
    createObjectUrlStub.reset();
  });

  it('should make a HTTP request if tile not in storage', async () => {
    // Prepare
    storage.get.resolves(undefined);
    httpGetStub.resolves({ data: new Blob(['123']) });

    // Act
    loadTile(tileStub, 'http://test.domain/1/2/3');

    // Assert
    await waitFor(() => {
      expect(storage.get.callCount).toEqual(1);
      expect(httpGetStub.args).toEqual([['http://test.domain/1/2/3']]);

      expect(storage.put.callCount).toEqual(1);
      expect(storage.put.args).toEqual([[{ version: CURRENT_VERSION, url: 'http://test.domain/1/2/3', image: new Blob(['123']) }]]);
    });
  });

  it('should NOT make a HTTP request if tile in storage', async () => {
    // Prepare
    storage.get.resolves(new Blob([]));
    httpGetStub.rejects();

    // Act
    loadTile(tileStub, 'http://test.domain/1/2/3');
    await TestHelper.wait(100);

    // Assert
    await waitFor(() => {
      expect(storage.get.callCount).toEqual(1);
      expect(httpGetStub.callCount).toEqual(0);
    });
  });

  it('should set image attributes', async () => {
    // Prepare
    storage.get.resolves(new Blob([]));

    // Act
    loadTile(tileStub, 'http://test.domain/1/2/3');

    // Assert
    await waitFor(() => {
      expect(storage.get.callCount).toEqual(1);
      expect(tileStub.getImage().getAttribute('src')).toEqual('http://test-object-url');
      expect(tileStub.getImage().getAttribute('crossorigin')).toEqual('Anonymous');
    });
  });

  it('should set status as error if request fail', async () => {
    // Prepare
    storage.get.rejects(new Error('Test error'));

    const tileStub = sinon.createStubInstance(ImageTile);

    // Act
    loadTile(tileStub, 'http://test.domain/1/2/3');

    // Assert
    await waitFor(() => {
      expect(storage.get.callCount).toEqual(1);
      expect(tileStub.setState.args).toEqual([[TileState.ERROR]]);
    });
  });

  it('should set tile empty if tile was not found', async () => {
    // Prepare
    storage.get.resolves(undefined);
    httpGetStub.rejects({ response: { status: 404 } });

    const tileStub = sinon.createStubInstance(ImageTile);

    // Act
    loadTile(tileStub, 'http://test.domain/1/2/3');

    // Assert
    await waitFor(() => {
      expect(storage.get.callCount).toEqual(1);
      expect(httpGetStub.callCount).toEqual(1);
      expect(tileStub.setState.args).toEqual([[TileState.EMPTY]]);
    });
  });

  it('should set status as error if tile is not supported', async () => {
    // Prepare
    storage.get.resolves(new Blob([]));

    const tileStub = sinon.createStubInstance(VectorTile);

    // Act
    loadTile(tileStub, 'http://test.domain/1/2/3');

    // Assert
    await waitFor(() => {
      expect(tileStub.setState.callCount).toEqual(1);
      expect(tileStub.setState.getCalls()[0].args).toEqual([TileState.ERROR]);
    });
  });
});
