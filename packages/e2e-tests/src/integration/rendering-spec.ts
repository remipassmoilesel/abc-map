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

import { FrontendRoutes } from '@abc-map/shared';
import { Toasts } from '../helpers/Toasts';
import { Download } from '../helpers/Download';
import { TestData } from '../test-data/TestData';
import { TestHelper } from '../helpers/TestHelper';
import { PdfComparison } from '../plugins/PdfComparison';

describe('Rendering spec', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('PDF rendering should be conform', function () {
    cy.visit(FrontendRoutes.map().raw())
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
      .then(() => Toasts.assertText('Projet importé !'))
      .get('[data-cy=layout]')
      .click()
      .get('[data-cy=layout-controls] [data-cy=pdf-export]')
      .click()
      .get('[data-cy=long-operation-done]', { timeout: 20_000 })
      .then(() => Toasts.assertText('Export terminé !'))
      .then(() => Download.fileAsBlob())
      .then((pdf) => pdf.arrayBuffer())
      .then((pdfContent) => cy.task<PdfComparison>('comparePdf', { actual: pdfContent, expected: 'test-project-3.pdf' }))
      .should((comparison) => expect(comparison.value).equal(0, `If rendering not conform, see ${comparison.diff}`));
  });
});
