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

import { Toasts } from '../helpers/Toasts';
import { Download } from '../helpers/Download';
import { TestData } from '../test-data/TestData';
import { TestHelper } from '../helpers/TestHelper';
import { PdfComparison } from '../plugins/PdfComparison';
import { LongOperation } from '../helpers/LongOperation';
import { Routes } from '../helpers/Routes';
import { TopBar } from '../helpers/TopBar';

describe('Rendering spec', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  /**
   * For the moment, this test only pass in continuous integration.
   *
   * If you know how to make it pass on all platforms, ping me !
   */
  it('PDF rendering should be conform', function () {
    cy.visit(Routes.map().format())
      .get('[data-cy=project-menu]')
      .click()
      .get('[data-cy=import-project]')
      .click()
      .get('[data-cy=confirmation-confirm]')
      .click()
      .then(() => TestData.projectSample3())
      .then((project) => {
        return cy.get('[data-cy=file-input]').attachFile({ filePath: 'project.abm2', fileContent: project });
      })
      .get('[data-cy=password-input]')
      .type('azerty1234')
      .get('[data-cy=password-confirm]')
      .click()
      .then(() => Toasts.assertText('Project loaded !'))
      .then(() => TopBar.export())
      .get('[data-cy=pdf-export]')
      .click()
      .then(() => LongOperation.done(50_000))
      .then(() => Download.fileAsBlob())
      .then((pdf) => pdf.arrayBuffer())
      .then((pdfContent) => cy.task<PdfComparison>('comparePdf', { actual: pdfContent, expected: 'test-project-3.pdf' }))
      .should((comparison) => expect(comparison.value).equal(0, `If rendering not conform, see ${comparison.diff}`));
  });
});
