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

import { parse, HTMLElement } from 'node-html-parser';
import * as glob from 'fast-glob';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import { execSync } from 'child_process';

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  await htmlValidate();
  await checksUrls();
}

// HTML validation of build
// We can not include html-validate in a "lint" task, because it needs documentation build
async function htmlValidate() {
  const pkgRoot = path.resolve(__dirname, '..');
  const command = 'node_modules/.bin/html-validate "build/**/*.html"';
  console.log('Running: ' + command);
  execSync(command, { cwd: pkgRoot, stdio: 'inherit' });
  console.log('Done.\n');
}

interface Document {
  path: string;
  content: HTMLElement;
}

interface Link {
  path: string;
  rawHref: string;
  resolvedHref: string;
}

interface TestResult {
  path: string;
  rawHref: string;
  resolvedHref: string;
  response: {
    status?: number;
    error?: Error;
  };
}

// We check that links in documentation are not broken
// FIXME: we should check existence of anchors too in documents returned by server
async function checksUrls() {
  const ignoredSchemes = ['mailto:', 'ftp:'];
  const baseUrl = 'http://localhost:10082';

  const logRoot = path.resolve(__dirname, `../logs`);
  const logFilePath = path.resolve(logRoot, `test-${Date.now()}.log`);
  const buildRoot = path.resolve(__dirname, '../build');

  // We parse all html documents
  const documents: Document[] = glob
    .sync('**/*.html', {
      cwd: buildRoot,
      ignore: ['**/node_modules/**'],
    })
    .map<Document>((docPath) => ({
      path: docPath,
      content: parse(fs.readFileSync(path.resolve(buildRoot, docPath)).toString('utf-8')),
    }));

  // We extract "A" tags and their href attributes
  const links: Link[] = documents
    .flatMap<{ link: HTMLElement; document: Document }>((document) => {
      return document.content.querySelectorAll('a').map((link) => ({
        link,
        document,
      }));
    })
    // Then we resolve href attributes
    .map<Link>(({ link, document }) => {
      const httpPath = document.path.replace('index.html', '');
      const rawHref = link.getAttribute('href')?.trim() ?? '';
      let href: string;

      // No href or scheme ignored
      if (!rawHref || ignoredSchemes.find((scheme) => rawHref.startsWith(scheme))) {
        href = '';
      }
      // External href
      else if (rawHref.startsWith('http')) {
        href = rawHref;
      }
      // Absolute href
      else if (rawHref.startsWith('/')) {
        href = baseUrl + rawHref;
      }
      // Relative href
      else {
        href = baseUrl + '/documentation/' + httpPath + rawHref;
      }

      return { rawHref: rawHref, resolvedHref: href, path: document.path };
    })
    // We keep only resolved href and href pointing to our server
    .filter((link) => !!link.resolvedHref && link.resolvedHref.includes(baseUrl));

  // We check extracted URLs
  console.log(`Checking ${links.length} links in ${documents.length} files ...\n`);
  let results: TestResult[] = [];
  const batchSize = 6;
  const batchNumber = Math.ceil(links.length / batchSize);
  for (let i = 0; i < batchNumber; i++) {
    const batchStart = i * batchSize;
    const batchEnd = i * batchSize + batchSize;
    const batch = links.slice(batchStart, batchEnd);

    const iteration = await Promise.all(
      batch.map((link) => {
        const resultTemplate: TestResult = {
          path: link.path,
          resolvedHref: link.resolvedHref,
          rawHref: link.rawHref,
          response: {},
        };

        return axios
          .get(link.resolvedHref, {
            timeout: 5_000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            },
          })
          .then<TestResult>((response) => ({
            ...resultTemplate,
            response: { status: response.status },
          }))
          .catch<TestResult>((error: Error) => ({
            ...resultTemplate,
            response: { error },
          }));
      })
    );

    results = results.concat(iteration);

    console.log('Progress: ' + Math.round((i / batchNumber) * 100) + '%');
  }

  // We write a log
  if (!fs.existsSync(logRoot)) {
    fs.mkdirSync(logRoot);
  }
  fs.writeFileSync(logFilePath, JSON.stringify(results, null, 2));

  // Then we display errors if any
  function formatError(result: TestResult, message: string): string {
    return `- ${[
      'File: ' + buildRoot + '/' + result.path,
      'Tested href: "' + result.resolvedHref + '"',
      'Raw href: "' + result.rawHref + '"',
      'Message: ' + message,
    ].join('\n  ')}\n`;
  }

  const errors = results
    .map((result) => {
      if (result.response.error) {
        return formatError(result, result.response.error?.message || '<no-message>');
      }

      const hasBadStatus = !(result.response.status + '').trim().startsWith('20');
      if (hasBadStatus) {
        return formatError(result, 'Bad status: ' + result.response.status ?? '<INVALID_STATUS>');
      }

      return '';
    })
    .filter((v) => !!v);

  if (errors.length) {
    errors.forEach((err) => console.error(err));
    console.log(`\n${results.length - errors.length} links ok.`);
    console.log(`${errors.length} links broken.\n`);
  } else {
    console.log('\nPassed !\n');
  }

  console.log(`\nWrote log: ${logFilePath}`);
  if (errors.length) {
    throw new Error(`${errors.length} links are broken`);
  }
}
