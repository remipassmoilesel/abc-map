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

import { MigrationProject } from './typings';
import { TestData } from './test-data/TestData';
import { FromV060ToV070 } from './FromV060ToV070';
import { AbcProjectManifest060 } from './dependencies/060-project-types';
import uniq from 'lodash/uniq';
import { TestHelper } from '../../utils/test/TestHelper';
import { AbcProjectManifest070 } from './dependencies/070-project-types';

describe('FromV060ToV070', () => {
  let sampleProject: MigrationProject<AbcProjectManifest060>;
  let migration: FromV060ToV070;

  beforeEach(async () => {
    sampleProject = await TestData.project060();
    migration = new FromV060ToV070();
  });

  it('interestedBy() should return true if version < 0.7', async () => {
    expect(await migration.interestedBy(sampleProject.manifest)).toEqual(true);
    expect(await migration.interestedBy(TestData.fakeProject('0.7.0'))).toEqual(false);
  });

  it('migrate should work', async () => {
    // Act
    const result = await migration.migrate(sampleProject.manifest, sampleProject.files);
    const manifest = result.manifest as unknown as AbcProjectManifest070;

    // Assert
    expect((manifest as unknown as AbcProjectManifest060).legend).toBeUndefined();

    const expectedLegend = {
      id: '',
      display: 'BottomLeftCorner',
      height: 96,
      width: 225,
      items: TestHelper.comparableObjects([
        {
          id: '',
          symbol: {
            geomType: 'Point',
            properties: { fill: {}, point: {}, stroke: {}, text: {} },
          },
          text: 'Element 1',
        },
        {
          id: '',
          symbol: {
            geomType: 'Point',
            properties: { fill: {}, point: { color: 'rgba(18,19,147,0.9)', icon: 'twbs/0_square-fill.inline.svg', size: 40 }, stroke: {}, text: {} },
          },
          text: 'Element 2',
        },
      ]),
    };

    const layoutLegends = manifest.layouts.map((lay) => lay.legend);
    expect(layoutLegends.length).toEqual(1);
    expect(layoutLegends[0].display).toEqual(expectedLegend.display);
    expect(layoutLegends[0].width).toEqual(expectedLegend.width);
    expect(layoutLegends[0].height).toEqual(expectedLegend.height);
    expect(TestHelper.comparableObjects(layoutLegends[0].items)).toEqual(TestHelper.comparableObjects(expectedLegend.items));

    const viewLegends = manifest.sharedViews.map((lay) => lay.legend);
    expect(viewLegends.length).toEqual(1);
    expect(viewLegends[0].display).toEqual(expectedLegend.display);
    expect(viewLegends[0].width).toEqual(expectedLegend.width);
    expect(viewLegends[0].height).toEqual(expectedLegend.height);
    expect(TestHelper.comparableObjects(viewLegends[0].items)).toEqual(TestHelper.comparableObjects(expectedLegend.items));

    expect(manifest.metadata.version).toEqual('0.7.0');

    const legends = manifest.layouts.map((lay) => lay.legend).concat(manifest.sharedViews.map((view) => view.legend));
    const ids = legends.flatMap((legend) => [legend.id, legend.items.map((item) => item.id)]);
    expect(uniq(ids)).toEqual(ids);
  });
});
