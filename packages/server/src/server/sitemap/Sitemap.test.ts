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
import { Sitemap } from './Sitemap';
import { Language } from '@abc-map/shared';
import { expect } from 'chai';
import { SinonStubbedInstance } from 'sinon';
import { DocumentationIndex } from '../../documentation/DocumentationIndex';
import * as sinon from 'sinon';
import { promises as fs } from 'fs';
import * as path from 'path';

describe('Sitemap', () => {
  describe('With a fake documentation index', () => {
    let index: SinonStubbedInstance<DocumentationIndex>;
    let generator: Sitemap;
    beforeEach(() => {
      index = sinon.createStubInstance(DocumentationIndex);
      generator = new Sitemap('http://domain.org', [Language.English, Language.French], index, ['ignored']);
    });

    it('should work', async () => {
      // Prepare
      index.getEntries.resolves([
        'en/reference/presentation/index.html',
        'fr/reference/presentation/index.html',
        'fr/reference/ignored/index.html',
        'fr/reference/only-in-french/index.html',
      ]);

      // Act
      const actual = await generator.build();

      // Assert
      // For debugging purposes
      await fs.writeFile(path.join(__dirname, 'test-data/actual-1.xml'), actual);

      const expected = (await fs.readFile(path.join(__dirname, 'test-data/expected-1.xml'))).toString('utf-8');
      expect(removeBlanks(removeDates(actual))).equals(removeBlanks(removeDates(expected)));
    });
  });

  // TODO: skip this annoying test
  describe('With a real documentation index', () => {
    let generator: Sitemap;
    beforeEach(() => {
      generator = Sitemap.create('http://domain.org');
    });

    it('should generate a sitemap', async () => {
      // Act
      const actual = await generator.build();

      // Assert
      // For debugging purposes
      await fs.writeFile(path.join(__dirname, 'test-data/actual-2.xml'), actual);

      const expected = (await fs.readFile(path.join(__dirname, 'test-data/expected-2.xml'))).toString('utf-8');
      expect(removeBlanks(removeDates(actual))).equals(removeBlanks(removeDates(expected)));
    });
  });
});

function removeBlanks(s: string): string {
  return s.replace(/\s/gi, '');
}

function removeDates(s: string): string {
  return s.replace(/<lastmod>[0-9]{4}-[0-9]{2}-[0-9]{2}<\/lastmod>/gi, '<lastmod>0000-00-00</lastmod>');
}
