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

import { TestData } from './test-data/TestData';
import { FromV130ToV140 } from './FromV130ToV140';
import { SinonStubbedInstance } from 'sinon';
import { ModalService } from '../../ui/ModalService';
import * as sinon from 'sinon';

describe('FromV130ToV140', () => {
  let modals: SinonStubbedInstance<ModalService>;
  let migration: FromV130ToV140;

  beforeEach(async () => {
    modals = sinon.createStubInstance(ModalService);
    migration = new FromV130ToV140(modals);
  });

  it('interestedBy() should return true if version < 1.4.0', async () => {
    const sampleProject = await TestData.project130();

    expect(await migration.interestedBy(sampleProject.manifest)).toEqual(true);
    expect(await migration.interestedBy(TestData.fakeProject('1.4.0'))).toEqual(false);
  });

  it('should migrate and warn only once', async () => {
    // Prepare
    const sampleProject = await TestData.project130();
    modals.warning.resolves();

    // Act
    const result = await migration.migrate(sampleProject.manifest, sampleProject.files);
    const manifest = result.manifest;

    // Assert
    expect(manifest).toMatchSnapshot();
    expect(modals.warning.callCount).toEqual(1);
    expect(modals.warning.args[0][0]).toEqual('Changes have been made to your project');
  });

  it('should not warn if silent', async () => {
    // Prepare
    const sampleProject = await TestData.project130();
    modals.warning.resolves();

    // Act
    const result = await migration.migrate(sampleProject.manifest, sampleProject.files, { silent: true });
    const manifest = result.manifest;

    // Assert
    expect(manifest).toMatchSnapshot();
    expect(modals.warning.callCount).toEqual(0);
  });
});
