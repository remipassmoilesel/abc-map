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

import { ProjectFactory } from './ProjectFactory';
import { Language, ProjectConstants } from '@abc-map/shared';
import { setLang } from '../../i18n/i18n';

describe('ProjectFactory', () => {
  afterEach(() => {
    return setLang(Language.English);
  });

  describe('newProjectMetadata()', () => {
    it('fr', async () => {
      await setLang(Language.French);

      const metadata = ProjectFactory.newProjectMetadata();
      expect(metadata.id).toBeDefined();
      expect(metadata.name).toMatch(/Projet du [0-9]+\/[0-9]+\/[0-9]+/);
      expect(metadata.version).toBe(ProjectConstants.CurrentVersion);
      expect(metadata.containsCredentials).toBe(false);
      expect(metadata.public).toBe(false);
    });

    it('en', async () => {
      await setLang(Language.English);

      const metadata = ProjectFactory.newProjectMetadata();
      expect(metadata.id).toBeDefined();
      expect(metadata.name).toMatch(/Project of [0-9]+\/[0-9]+\/[0-9]+/);
      expect(metadata.version).toBe(ProjectConstants.CurrentVersion);
    });
  });

  it('newProjectManifest()', () => {
    const manifest = ProjectFactory.newProjectManifest();
    expect(manifest.layers).toHaveLength(0);
    expect(manifest.layouts).toHaveLength(0);
    expect(manifest.legend).toBeDefined();
    expect(manifest.view).toBeDefined();
  });

  it('newLegend()', () => {
    const legend = ProjectFactory.newLegend();
    expect(legend).toEqual({ display: 'Hidden', height: 250, items: [], width: 250 });
  });
});
