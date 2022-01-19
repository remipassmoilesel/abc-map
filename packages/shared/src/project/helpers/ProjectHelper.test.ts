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

import { ProjectHelper } from './ProjectHelper';
import { AbcFile, Zipper } from '../../zip';
import { ProjectConstants } from '../ProjectConstants';

describe('ProjectHelper', () => {
  it('should find manifest', async () => {
    const files: AbcFile[] = [{ path: ProjectConstants.ManifestName, content: Buffer.from('{"variable":"value"}') }];
    const project = await Zipper.forBackend().zipFiles(files);

    const manifest = await ProjectHelper.forBackend().extractManifest(project);

    expect(manifest as object).toEqual({ variable: 'value' });
  });

  it('should fail', async () => {
    const files: AbcFile[] = [];
    const project = await Zipper.forBackend().zipFiles(files);

    const err: Error = await ProjectHelper.forBackend()
      .extractManifest(project)
      .catch((err) => err);

    expect(err).toBeInstanceOf(Error);
    expect(err.message).toEqual('No manifest found');
  });
});
