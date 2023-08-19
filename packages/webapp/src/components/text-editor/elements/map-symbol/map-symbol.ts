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

import { Editor, Transforms } from 'slate';
import { AbcGeometryType, FeatureStyle, Logger, MapSymbolElement, TableElement, TableRowElement } from '@abc-map/shared';

const logger = Logger.get('mapSymbol.ts');

export type StyleInput = [FeatureStyle, AbcGeometryType];

export const mapSymbol = {
  create(editor: Editor, style: FeatureStyle, geometryType: AbcGeometryType) {
    const node: MapSymbolElement = { type: 'map-symbol', style, geometryType, children: [{ text: '' }] };
    Transforms.insertNodes(editor, [node]);
  },

  createLegend(editor: Editor, styles: StyleInput[]) {
    if (!styles.length) {
      logger.error('Styles are empty');
      return;
    }

    // We create a table
    const table: TableElement = { type: 'table', border: 0, children: [] };
    for (let i = 0; i < styles.length; i++) {
      const [style, geometryType] = styles[i];

      // We create a row then add one cell with symbol, one empty cell
      const row: TableRowElement = { type: 'table-row', children: [] };
      row.children.push({
        type: 'table-cell',
        children: [{ type: 'paragraph', align: 'center', children: [{ type: 'map-symbol', style, geometryType, children: [{ text: '' }] }] }],
      });

      row.children.push({ type: 'table-cell', children: [{ type: 'paragraph', children: [{ text: '' }] }] });

      table.children.push(row);
    }

    Transforms.insertNodes(editor, [table]);
  },
};
