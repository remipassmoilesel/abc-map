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

import { DataStoreScanner, logger } from './DataStoreScanner';
import { SinonStub, SinonStubbedInstance } from 'sinon';
import { ManifestReader } from './ManifestReader';
import * as sinon from 'sinon';
import { assert } from 'chai';
import { ArtefactManifest } from './ArtefactManifest';

logger.disable();

describe('DataStoreScanner', () => {
  let globFunction: SinonStub;
  let reader: SinonStubbedInstance<ManifestReader>;
  let scanner: DataStoreScanner;

  beforeEach(() => {
    globFunction = sinon.stub();
    reader = sinon.createStubInstance(ManifestReader);
    scanner = new DataStoreScanner(reader as unknown as ManifestReader, globFunction);
  });

  it('should return manifests', async () => {
    // Prepare
    globFunction.resolves(['/manifest/1.yml', '/manifest/2.yml']);
    reader.read.onFirstCall().resolves(fakeManifest('manifest-1'));
    reader.read.onSecondCall().resolves(fakeManifest('manifest-2'));

    // Act
    const result = await scanner.scan('/path/to/root');

    // Assert
    assert.deepEqual(globFunction.args, [['{/path/to/root/**/artefact.yml,/path/to/root/**/artefact.yaml}', { nocase: true }]]);
    assert.deepEqual(reader.read.args, [['/manifest/1.yml'], ['/manifest/2.yml']]);
    assert.deepEqual(result, [fakeManifest('manifest-1'), fakeManifest('manifest-2')]);
  });

  it('should not fail on error', async () => {
    // Prepare
    globFunction.resolves(['/manifest/1.yml', '/manifest/2.yml']);
    reader.read.onFirstCall().resolves(fakeManifest('manifest-1'));
    reader.read.onSecondCall().rejects();

    // Act
    const result = await scanner.scan('/path/to/root');

    // Assert
    assert.deepEqual(result, [fakeManifest('manifest-1')]);
  });
});

function fakeManifest(name: string): ArtefactManifest {
  return { name } as unknown as ArtefactManifest;
}
