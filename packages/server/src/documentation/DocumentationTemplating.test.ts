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
 *
 *
 *
 */

import { DocumentationTemplating, EndMark, StartMark } from './DocumentationTemplating';
import { Config, UserDocConfig } from '../config/Config';
import { SinonStubbedInstance } from 'sinon';
import { DocumentationIndex } from './DocumentationIndex';
import * as sinon from 'sinon';
import * as fs from 'fs';
import * as uuid from 'uuid-random';
import { expect } from 'chai';
import { execSync } from 'child_process';
import { ConfigLoader } from '../config/ConfigLoader';
import * as path from 'path';

describe('DocumentationTemplating', () => {
  describe('with a fake index', () => {
    let index: SinonStubbedInstance<DocumentationIndex>;
    let testRoot: string;
    let config: Partial<Config>;
    let templating: DocumentationTemplating;

    beforeEach(() => {
      index = sinon.createStubInstance(DocumentationIndex);

      testRoot = '/tmp/user-documentation-test-' + uuid();
      fs.mkdirSync(testRoot);

      config = {
        userDocumentation: {
          appendToBody: '<script src="/analytics.js"></script>\n<script src="/analytics-2.js"></script>',
        },
        userDocumentationPath: testRoot,
      };
      templating = new DocumentationTemplating(config as Config, index);
    });

    it('should work even if there are no page to template', async () => {
      index.getEntries.resolves([]);

      await templating.templatePages();
    });

    it('should template files if needed', async () => {
      // Prepare
      const index1 = `
      <html>
        <head><title>Documentation</title></head>
        <body>
            <h1>Documentation</h1>
            <div style="display: none">%%%append-to-body%%%   %%%end-append-to-body%%%</div>
        </body>
        </html>
    `;

      await fs.writeFileSync(testRoot + '/index-1.html', index1);
      await fs.writeFileSync(testRoot + '/index-2.html', '<html><head></head></html>\n\n\n');

      // Paths are relative to documentation root
      index.getEntries.resolves(['index-1.html', 'index-2.html']);

      // Act
      await templating.templatePages();

      // Assert
      expect(fs.readFileSync(testRoot + '/index-1.html').toString('utf-8')).toMatchSnapshot();
      expect(fs.readFileSync(testRoot + '/index-2.html').toString('utf-8')).toMatchSnapshot();
    });

    it('should template files twice if needed', async () => {
      // Prepare
      await fs.writeFileSync(
        testRoot + '/index-1.html',
        '<html><head></head><body><div style="display: none">%%%append-to-body%%%   %%%end-append-to-body%%%</div></body></html>'
      );
      await fs.writeFileSync(testRoot + '/index-2.html', '<html><head></head></html>\n\n\n');

      // Paths are relative to documentation root
      index.getEntries.resolves(['index-1.html', 'index-2.html']);

      await templating.templatePages();

      (config.userDocumentation as UserDocConfig).appendToBody =
        '<script src="/another-analytics.js"></script>\n<script src="/another-analytics-2.js"></script>';

      // Act
      await templating.templatePages();

      // Assert
      expect(fs.readFileSync(testRoot + '/index-1.html').toString('utf-8')).toMatchSnapshot();
      expect(fs.readFileSync(testRoot + '/index-2.html').toString('utf-8')).toMatchSnapshot();
    });
  });

  describe('with a real index', () => {
    let testRoot: string;
    let config: Config;
    let templating: DocumentationTemplating;

    beforeEach(async () => {
      config = await ConfigLoader.load();

      testRoot = '/tmp/user-documentation-test-' + uuid();
      fs.mkdirSync(testRoot);

      execSync(`cp -R ${config.userDocumentationPath}/* ${testRoot}`);

      templating = DocumentationTemplating.create({
        ...config,
        userDocumentation: {
          appendToBody: '<script src="/analytics.61ef55a258496.js"></script>\n<script src="/analytics.87fcfef6ee362852.js"></script>',
        },
        userDocumentationPath: testRoot,
      });
    });

    it('integration test', async () => {
      // Prepare
      const files = [path.resolve(testRoot + '/index.html'), path.resolve(testRoot + '/fr/index.html'), path.resolve(testRoot + '/en/index.html')];

      const beforeContent = files.map((filePath) => fs.readFileSync(filePath).toString('utf-8'));
      beforeContent.forEach((content) => {
        expect(content.includes(StartMark)).true;
        expect(content.includes(EndMark)).true;
      });

      // Act
      await templating.templatePages();

      // Assert
      const afterContent = files.map((filePath) => [filePath, fs.readFileSync(filePath).toString('utf-8')]);
      afterContent.forEach(([, content]) => {
        expect(content.includes(StartMark)).true;
        expect(content.includes(EndMark)).true;
        expect(content.includes('analytics.61ef55a258496.js')).true;
        expect(content.includes('analytics.87fcfef6ee362852.js')).true;
      });
    });
  });
});
