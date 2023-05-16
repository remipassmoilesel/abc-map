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

import { disableTileImageLogging, setMaxObjectsUrl, setTileImage } from './setTileImage';
import * as sinon from 'sinon';
import { SinonStub, SinonStubbedInstance } from 'sinon';
import ImageTile from 'ol/ImageTile';

disableTileImageLogging();

describe('setTileImage', () => {
  let tileStub: SinonStubbedInstance<ImageTile>;

  beforeEach(() => {
    tileStub = sinon.createStubInstance(ImageTile);
    const tileImage = document.createElement('img');
    tileStub.getImage.returns(tileImage);

    setMaxObjectsUrl(3);

    let i = 1;
    (URL.createObjectURL as SinonStub).callsFake(() => 'http://tile/' + i++);
  });

  it('should revoke urls if too many loaded', () => {
    setTileImage(tileStub, new Blob(['123']));
    setTileImage(tileStub, new Blob(['123']));
    setTileImage(tileStub, new Blob(['123']));
    setTileImage(tileStub, new Blob(['123']));
    setTileImage(tileStub, new Blob(['123']));

    expect((URL.revokeObjectURL as SinonStub).args).toEqual([['http://tile/1'], ['http://tile/2']]);
  });
});
