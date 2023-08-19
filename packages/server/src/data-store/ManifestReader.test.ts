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
import { FileModule, ManifestReader } from './ManifestReader';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { assert } from 'chai';
import { ArtefactType, Language } from '@abc-map/shared';

describe('ManifestReader', () => {
  let readFileStub: SinonStub;
  let statStub: SinonStub;
  let reader: ManifestReader;

  beforeEach(() => {
    readFileStub = sinon.stub();
    statStub = sinon.stub();

    reader = new ManifestReader({ readFile: readFileStub, stat: statStub } as unknown as FileModule);
  });

  it('should read', async () => {
    // Prepare
    const rawManifest = `
---
version: 0.1.0
artefact:
  name:
    - language: fr
      text: Régions de France
  type: basemap
  license: LICENCE.txt
  attributions:
    - Copyright somebody somewhere inc
  provider: 'data.gouv.fr'
  link: https://www.data.gouv.fr/fr/datasets/contours-des-regions-francaises-sur-openstreetmap/
  description:
    - language: fr
      text: Régions de France 2016, avec noms et surfaces
    - language: en
      text: Regions of France 2016, with names and surfaces
  keywords:
    - language: fr
      text:
        - régions
        - France
    - language: en
      text:
        - regions
        - France
  files:
    - regions-20161121-shp.zip
    `;
    readFileStub.resolves(rawManifest);
    statStub.resolves({ isFile: () => true });

    // Act
    const result = await reader.read('/path/to/manifest.yml');

    // Assert
    assert.deepEqual(result, {
      version: '0.1.0',
      artefact: {
        name: [{ language: Language.French, text: 'Régions de France' }],
        type: ArtefactType.BaseMap,
        license: 'LICENCE.txt',
        attributions: ['Copyright somebody somewhere inc'],
        description: [
          { language: Language.French, text: 'Régions de France 2016, avec noms et surfaces' },
          { language: Language.English, text: 'Regions of France 2016, with names and surfaces' },
        ],
        keywords: [
          { language: Language.French, text: ['régions', 'France'] },
          { language: Language.English, text: ['regions', 'France'] },
        ],
        provider: 'data.gouv.fr',
        link: 'https://www.data.gouv.fr/fr/datasets/contours-des-regions-francaises-sur-openstreetmap/',
        files: ['regions-20161121-shp.zip'],
      },
      path: '/path/to/manifest.yml',
    });
  });

  it('should return error if lang is unsupported', async () => {
    // Prepare
    const rawManifest = `
---
version: 0.1.0
artefact:
  license: LICENCE.txt
  name:
    - language: fr
      text: Régions de France
    - language: en
      text: Regions of France
  attributions:
    - Copyright someone somewhere
  description:
    - language: fr
      text: Régions de France 2016, avec noms et surfaces
    - language: en
      text: Regions of France 2016, with names and surfaces
  keywords:
    - language: fr
      text:
        - régions
        - France
    - language: ru    # Unsupported lang
      text:
        - regions
        - France
  provider: Nowhere inc
  link: https://www.data.gouv.fr/fr/datasets/contours-des-regions-francaises-sur-openstreetmap/
  files:
    - regions-20161121-shp.zip
    `;
    readFileStub.resolves(rawManifest);
    statStub.resolves({ isFile: () => true });

    // Act
    const error = (await reader.read('/path/to/manifest.yml').catch((err) => err)) as Error;

    // Assert
    assert.deepEqual(error.message, 'Invalid keyword lang: ru');
  });
});
