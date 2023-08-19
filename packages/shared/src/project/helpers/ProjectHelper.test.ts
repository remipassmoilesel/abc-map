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

import { ProjectHelper } from './ProjectHelper';
import { AbcFile, Zipper } from '../../zip';
import { ProjectConstants } from '../constants/ProjectConstants';
import { AbcProjectManifest } from '../AbcProjectManifest';

describe('ProjectHelper', () => {
  describe('extractManifest()', () => {
    it('should find manifest', async () => {
      // Prepare
      const files: AbcFile<Buffer>[] = [{ path: ProjectConstants.ManifestName, content: Buffer.from('{"variable":"value"}') }];
      const project = await Zipper.forNodeJS().zipFiles(files);

      // Act
      const manifest = await ProjectHelper.forNodeJS().extractManifest(project);

      // Assert
      expect(manifest).toEqual({ variable: 'value' });
    });

    it('should fail', async () => {
      // Prepare
      const files: AbcFile<Buffer>[] = [];
      const project = await Zipper.forNodeJS().zipFiles(files);

      // Act
      const err: Error = await ProjectHelper.forNodeJS()
        .extractManifest(project)
        .catch((err) => err);

      // Assert
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toEqual('No manifest found');
    });
  });

  describe('updateManifest()', () => {
    it('should update manifest', async () => {
      // Prepare
      const files: AbcFile<Buffer>[] = [];
      const originalManifest = { metadata: { id: 'project-1', name: 'Project 1' } } as unknown as AbcProjectManifest;
      files.push({ path: ProjectConstants.ManifestName, content: Buffer.from(JSON.stringify(originalManifest)) });
      files.push({ path: 'asset.png', content: Buffer.from([1, 2, 3, 4]) });

      const original = await Zipper.forNodeJS().zipFiles(files);

      // Act
      const manifestUpdate = { metadata: { id: 'project-2', name: 'Project 2' } } as unknown as AbcProjectManifest;
      const newProject = await ProjectHelper.forNodeJS().updateManifest(original, manifestUpdate);

      // Assert
      expect(newProject.metadata).toEqual(manifestUpdate.metadata);
      const newProjectFiles = await Zipper.forNodeJS().unzip(newProject.project);
      expect(newProjectFiles.length).toEqual(2);

      const dManifest = JSON.parse(newProjectFiles.find((f) => f.path === ProjectConstants.ManifestName)?.content.toString() || '');
      expect(dManifest).toEqual(manifestUpdate);

      const asset = newProjectFiles.find((f) => f.path !== ProjectConstants.ManifestName);
      expect(asset).toEqual({ path: 'asset.png', content: Buffer.from([1, 2, 3, 4]) });
    });
  });
});
