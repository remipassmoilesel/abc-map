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

import { TestHelper } from '../helpers/TestHelper';
import { DataStore } from '../helpers/DataStore';
import { Download } from '../helpers/Download';
import { Modules } from '../helpers/Modules';
import { FilePrompt } from '../helpers/FilePrompt';
import { BundledModuleId } from '@abc-map/shared';

describe('Data table', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('User can display layer data', () => {
    DataStore.importByName('Countries of the world')
      .then(() => Modules.open(BundledModuleId.DataTable))
      .get('[data-cy=layer-selector] > option')
      .eq(3)
      .then((opt) => cy.get('[data-cy=layer-selector]').select(opt.text()))
      .get('[data-cy=table-header]')
      .should((elems) => {
        expect(elems.toArray().map((e) => e.textContent)).deep.equal(['#', 'COUNTRY', '']);
      })
      .get('[data-cy=table-cell]')
      .should((elems) => {
        expect(elems).length(54);

        const cells = elems
          .toArray()
          .slice(0, 20)
          .map((e) => e.textContent);

        expect(cells).deep.equal([
          '1',
          'South Korea',
          '',
          '2',
          'Turkmenistan',
          '',
          '3',
          'Tajikistan',
          '',
          '4',
          'North Korea',
          '',
          '5',
          'Uzbekistan',
          '',
          '6',
          'Mongolia',
          '',
          '7',
          'Kyrgyzstan',
        ]);
      });
  });

  it('User can export as CSV', () => {
    DataStore.importByName('Countries of the world')
      .then(() => Modules.open(BundledModuleId.DataTable))
      .get('[data-cy=layer-selector] > option')
      .eq(3)
      .then((opt) => cy.get('[data-cy=layer-selector]').select(opt.text()))
      .get('[data-cy=csv-export]')
      .click()
      .then(() => Download.currentFileAsBlob())
      .should((file) => {
        expect(file).not.undefined;
        // We do not check content here
        expect(file.size).equal(6_201);
      });
  });

  it('User can add column with import', () => {
    let csvFile: string;

    // We import from data store
    DataStore.importByName('Countries of the world')
      .then(() => Modules.open(BundledModuleId.DataTable))
      .get('[data-cy=layer-selector] > option')
      .eq(3)
      .then((opt) => cy.get('[data-cy=layer-selector]').select(opt.text()))
      // Then we export
      .get('[data-cy=csv-export]')
      .click()
      .then(() => Download.currentFileAsBlob())
      .then((file) => file.text())
      // We modify file content then import it
      .then((content) => {
        csvFile = content
          .split('\r\n')
          .map((line, i) => (i === 0 ? line + ',NAME_SIZE' : line + ',' + line.length))
          .join('\n');
      })
      .get('[data-cy=csv-import-modal]')
      .click()
      .get('[data-cy=csv-import]')
      .click()
      .then(() => FilePrompt.select('file.csv', new Blob([csvFile])))
      // We check import result
      .get('[data-cy=rows-imported]')
      .contains('252 rows modified')
      .get('[data-cy=rows-skipped]')
      .contains('0 rows skipped')
      .get('[data-cy=close-import-modal')
      .click()
      // We check display
      .get('[data-cy=table-header]')
      .should((elems) => {
        expect(elems.toArray().map((e) => e.textContent)).deep.equal(['#', 'COUNTRY', 'NAME_SIZE', '']);
      })
      .get('[data-cy=table-cell]')
      .should((elems) => {
        expect(elems).length(72);

        const cells = elems
          .toArray()
          .slice(0, 20)
          .map((e) => e.textContent);

        expect(cells).deep.equal([
          '1',
          'South Korea',
          '22',
          '',
          '2',
          'Turkmenistan',
          '23',
          '',
          '3',
          'Tajikistan',
          '21',
          '',
          '4',
          'North Korea',
          '22',
          '',
          '5',
          'Uzbekistan',
          '21',
          '',
        ]);
      });
  });
});
