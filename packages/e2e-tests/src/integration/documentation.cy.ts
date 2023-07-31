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

import { TestHelper } from '../helpers/TestHelper';
import { Routes } from '../helpers/Routes';

describe('Documentation', function () {
  const automatedTestTarget = Routes.module().withParams({ moduleId: 'documentation' }) + '/automated-test-target';

  beforeEach(() => {
    return TestHelper.init();
  });

  describe('As a visitor, in webapp', () => {
    it('can navigate in documentation in webapp', function () {
      cy.visit(Routes.module().withParams({ moduleId: 'documentation' }))
        .get('[data-title="table-of-content"]')
        // We click on first link
        .get('[data-cy=documentation-content] a[href="reference/01_presentation/"]')
        .click()
        .get('[data-title="presentation"]')
        // We click on "Table of content"
        .get('[data-cy=go-to-table-of-content]')
        .click()
        .get('[data-title="table-of-content"]');
    });

    it('can switch from app to another tab', function () {
      cy.visit(Routes.module().withParams({ moduleId: 'documentation' }))
        .get('[data-title="table-of-content"]')
        // We click on first link
        .get('[data-cy=documentation-content] a[href="reference/01_presentation/"]')
        .click()
        .get('[data-title="presentation"]')
        // We click on "Open in new tab"
        .get('[data-cy=open-in-new-tab]')
        .click()
        .get('[data-cy="in-static-documentation"]')
        .get('[data-title="presentation"]');
    });

    it('assets can load correctly', () => {
      cy.visit(automatedTestTarget)
        // We check that sample image has loaded
        .get('[data-cy=sample-image]')
        .should('be.visible')
        .and('have.prop', 'naturalWidth')
        .should('be.greaterThan', 0)
        // We check that sample video has loaded
        .get('[data-cy=sample-video]')
        .get('[data-cy=sample-image]')
        .should('be.visible')
        .and('have.prop', 'naturalWidth')
        .should('be.greaterThan', 0);
    });
  });

  describe('As a visitor, in static documentation', () => {
    it('can navigate in static documentation', function () {
      cy.visit('/documentation/en/')
        .get('[data-title="table-of-content"]')
        // We click on first link
        .get('[data-cy=documentation-content] a[href="reference/01_presentation/"]')
        .click()
        .get('[data-title="presentation"]')
        // We click on "Table of content". We force because of a bad scroll behavior with cypress
        .get('[data-cy=go-to-table-of-content]')
        .click({ force: true })
        .get('[data-title="table-of-content"]');
    });

    it('can switch from another tab to app', function () {
      cy.visit('/documentation/en/')
        .get('[data-title="table-of-content"]')
        // We click on first link
        .get('[data-cy=documentation-content] a[href="reference/01_presentation/"]')
        .click()
        .get('[data-title="presentation"]')
        // We click on "Open in app"
        .get('[data-cy=open-in-app]')
        .click()
        .get('[data-cy="in-app-documentation"]')
        .get('[data-title="presentation"]');
    });

    it('assets can load correctly', () => {
      cy.visit(automatedTestTarget)
        // We check that sample image has loaded
        .get('[data-cy=sample-image]')
        .should('be.visible')
        .and('have.prop', 'naturalWidth')
        .should('be.greaterThan', 0)
        // We check that sample video has loaded
        .get('[data-cy=sample-video]')
        .get('[data-cy=sample-image]')
        .should('be.visible')
        .and('have.prop', 'naturalWidth')
        .should('be.greaterThan', 0);
    });
  });
});
