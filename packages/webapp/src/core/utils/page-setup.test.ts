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

import { addNoIndexMeta, pageSetup, removeNoIndexMeta } from './page-setup';

describe('page-setup', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('pageSetup() should set title and description, even if meta description does not exists', () => {
    pageSetup('Test title', 'Test description');

    expect(document.head.innerHTML).toEqual(`<title>Abc-Map - Test title</title><meta name="description" content="Test description">`);
  });

  it('pageSetup() change title and description', () => {
    // Prepare
    pageSetup('Test title', 'Test description');

    // Act
    pageSetup('Test title 2', 'Test description 2');

    // Assert
    expect(document.head.innerHTML).toEqual(`<title>Abc-Map - Test title 2</title><meta name="description" content="Test description 2">`);
  });

  it('addNoIndexMeta()', () => {
    addNoIndexMeta();

    expect(document.head.innerHTML).toEqual(`<meta name="robots" content="noindex">`);
  });

  it('addNoIndexMeta() twice', () => {
    // Prepare
    addNoIndexMeta();

    // Act
    addNoIndexMeta();

    // Assert
    expect(document.head.innerHTML).toEqual(`<meta name="robots" content="noindex">`);
  });

  it('removeNoIndexMeta() should not fail', () => {
    removeNoIndexMeta();

    expect(document.head.innerHTML).toEqual(``);
  });

  it('removeNoIndexMeta() should not remove', () => {
    // Prepare
    addNoIndexMeta();

    // Act
    removeNoIndexMeta();

    // Assert
    expect(document.head.innerHTML).toEqual(``);
  });
});
