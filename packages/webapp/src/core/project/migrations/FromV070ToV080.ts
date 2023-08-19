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

import { AbcFile, AbcLayout, AbcSharedView, AbcTextFrame, Logger, TableElement, TableRowElement, TextFrameChild } from '@abc-map/shared';
import { MigrationProject, ProjectMigration } from './typings';
import semver from 'semver';
import { AbcLayout070, AbcProjectManifest070, AbcSharedView070 } from './dependencies/070-project-types';
import { AbcLegend060, LegendDisplay } from './dependencies/060-legend-types';
import { nanoid } from 'nanoid';
import { AbcProjectManifest080 } from './dependencies/080-project-types';

const NEXT = '0.8.0';

const logger = Logger.get('FromV070ToV080.ts');

/**
 * This migration transforms legends in text frames
 */
export class FromV070ToV080 implements ProjectMigration<AbcProjectManifest070, AbcProjectManifest080> {
  public async interestedBy(manifest: AbcProjectManifest070): Promise<boolean> {
    const version = manifest.metadata.version;
    return semver.lt(version, NEXT);
  }

  public async migrate(_manifest: AbcProjectManifest070, files: AbcFile<Blob>[]): Promise<MigrationProject<AbcProjectManifest080>> {
    const manifest = _manifest as unknown as AbcProjectManifest070;

    const layouts: AbcLayout[] = manifest.layouts.map((lay) => {
      const frame = this.legendToFrame(lay.legend);
      const migrated = { ...lay, textFrames: frame ? [frame] : [] };
      delete (migrated as Partial<AbcLayout070>).legend;
      return migrated;
    });

    const sharedViews: AbcSharedView[] = manifest.sharedViews.map((view) => {
      const frame = this.legendToFrame(view.legend);
      const migrated = { ...view, textFrames: frame ? [frame] : [] };
      delete (migrated as Partial<AbcSharedView070>).legend;
      return migrated;
    });

    return {
      manifest: {
        ...manifest,
        layouts,
        sharedViews,
        metadata: {
          ...manifest.metadata,
          version: NEXT,
        },
      },
      files,
    };
  }

  private legendToFrame(legend: AbcLegend060): AbcTextFrame | undefined {
    if (legend.display === LegendDisplay.Hidden) {
      return;
    }

    // Create table from items
    const table: TableElement = {
      type: 'table',
      border: 0,
      children: [],
    };

    for (const item of legend.items) {
      const row: TableRowElement = { type: 'table-row', children: [] };

      // Add symbol
      let firstCell: TextFrameChild;
      if (item.symbol) {
        firstCell = { type: 'map-symbol', style: item.symbol.properties, geometryType: item.symbol.geomType, children: [{ text: '' }] };
      } else {
        firstCell = { text: '' };
      }

      row.children.push({ type: 'table-cell', children: [{ type: 'paragraph', align: 'center', children: [firstCell] }] });

      // Add text
      row.children.push({ type: 'table-cell', children: [{ type: 'paragraph', children: [{ text: item.text }] }] });

      table.children.push(row);
    }

    return {
      id: nanoid(),
      size: { width: legend.width * 2, height: legend.height * 2.5 },
      position: { x: 0, y: 0 },
      content: [{ type: 'paragraph', children: [{ text: '' }] }, table, { type: 'paragraph', children: [{ text: '' }] }],
    } as AbcTextFrame;
  }
}
