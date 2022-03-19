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

import { AbcProjectManifest, LayerType } from '@abc-map/shared';
import { FromV020ToV030 } from './FromV020ToV030';
import { ModalService } from '../../ui/ModalService';
import sinon, { SinonStubbedInstance } from 'sinon';
import { ModalEventType, ModalStatus } from '../../ui/typings';
import { TestData } from './test-data/TestData';
import { MigratedProject } from './typings';
import { WmsMetadata030 } from './old-typings/030-project';

describe('FromV020ToV030', () => {
  let modals: SinonStubbedInstance<ModalService>;
  let sampleProject: MigratedProject;
  let migration: FromV020ToV030;

  beforeEach(async () => {
    sampleProject = await TestData.project020();
    modals = sinon.createStubInstance(ModalService);
    migration = new FromV020ToV030(modals as unknown as ModalService);
  });

  it('interestedBy() should return true if version < 0.3', async () => {
    expect(await migration.interestedBy(sampleProject.manifest)).toEqual(true);
    expect(await migration.interestedBy(TestData.fakeProject('0.3.0'))).toEqual(false);
  });

  it('migrate should work', async () => {
    // Prepare
    modals.setPasswordModal.resolves({ type: ModalEventType.SetPasswordClosed, status: ModalStatus.Confirmed, value: 'azerty1234' });

    // Act
    const result = await migration.migrate(sampleProject.manifest, sampleProject.files);

    // Assert
    expect(result.manifest.metadata).toEqual({ ...sampleProject.manifest.metadata, containsCredentials: true, version: '0.3.0' });

    const metadata = result.manifest.layers[2].metadata as unknown as WmsMetadata030;
    expect(metadata.remoteUrl).toMatch(/encrypted:.+/);
    expect(metadata.remoteUrl).not.toContain('http://localhost');
  });

  it('migrate do nothing if url is encrypted', async () => {
    // Prepare
    const project = {
      ...sampleProject.manifest,
      layers: [
        {
          type: LayerType.Wms,
          metadata: {
            ...sampleProject.manifest.layers[2].metadata,
            remoteUrl: 'encrypted:XXXXXXXXXXXXXXXXX',
          },
        },
      ],
    };

    // Act
    await migration.migrate(project as unknown as AbcProjectManifest, []).catch((err) => err);

    // Assert
    expect(modals.setPasswordModal.callCount).toEqual(0);
  });

  it('migrate should fail if password not provided', async () => {
    // Prepare
    modals.setPasswordModal.resolves({ type: ModalEventType.SetPasswordClosed, status: ModalStatus.Canceled, value: '' });

    // Act
    const error: Error = await migration.migrate(sampleProject.manifest as unknown as AbcProjectManifest, []).catch((err) => err);

    // Assert
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toEqual('Password is mandatory');
  });
});
