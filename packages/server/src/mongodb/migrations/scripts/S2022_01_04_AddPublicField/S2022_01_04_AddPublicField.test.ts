/**
 * Copyright © 2023 Rémi Pace.
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

import { S2022_01_04_AddPublicField } from './S2022_01_04_AddPublicField';
import { SinonStubbedInstance } from 'sinon';
import * as sinon from 'sinon';
import { assert } from 'chai';
import { ProjectDao } from '../../../../projects/ProjectDao';

describe('S2022_01_04_AddPublicField', function () {
  let projectDao: SinonStubbedInstance<ProjectDao>;
  let script: S2022_01_04_AddPublicField;

  beforeEach(() => {
    projectDao = sinon.createStubInstance(ProjectDao);
    script = new S2022_01_04_AddPublicField(projectDao);
  });

  it('should remove alias if any', async () => {
    projectDao.findAllMetadata.resolves([{ _id: 'test-project-id-1' }, { _id: 'test-project-id-2' }] as any);

    await script.migrate();

    assert.equal(projectDao.findAllMetadata.callCount, 1);
    assert.deepEqual(projectDao.saveAllMetadata.args, [
      [
        [
          { _id: 'test-project-id-1', public: false },
          { _id: 'test-project-id-2', public: false },
        ],
      ],
    ] as any);
  });
});
