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

import { S2023_08_06_RemoveCredentialsField } from './S2023_08_06_RemoveCredentialsField';
import * as sinon from 'sinon';
import { SinonStubbedInstance } from 'sinon';
import { assert } from 'chai';
import { ProjectDao } from '../../../../projects/ProjectDao';

describe('S2022_01_04_AddPublicField', function () {
  let projectDao: SinonStubbedInstance<ProjectDao>;
  let script: S2023_08_06_RemoveCredentialsField;

  beforeEach(() => {
    projectDao = sinon.createStubInstance(ProjectDao);
    script = new S2023_08_06_RemoveCredentialsField(projectDao);
  });

  it('should remove alias if any', async () => {
    projectDao.findAllMetadata.resolves([
      { _id: 'test-project-id-1', containsCredentials: true },
      { _id: 'test-project-id-2', containsCredentials: false },
    ] as any);

    await script.migrate();

    assert.equal(projectDao.findAllMetadata.callCount, 1);
    assert.deepEqual(projectDao.saveAllMetadata.args, [[[{ _id: 'test-project-id-1' }, { _id: 'test-project-id-2' }]]] as any);
  });
});
