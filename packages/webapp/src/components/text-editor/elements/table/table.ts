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

import { Editor, Element, Transforms } from 'slate';
import { TableElement, TableCellElement, TableRowElement } from '@abc-map/shared';
import { Logger } from '@abc-map/shared';

const logger = Logger.get('table.ts');

export const table = {
  /**
   * Creates a table with specified rows and cols numbers
   * @param editor
   * @param rows
   * @param cols
   */
  createTable(editor: Editor, rows = 4, cols = 4) {
    // We check if we are already in table
    // Nested tables are forbidden
    const [inTable] = Editor.nodes<TableElement>(editor, {
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table',
    });

    if (inTable) {
      logger.debug('Cannot add table here');
      return;
    }

    // We create a table and fill it with rows
    const table: TableElement = { type: 'table', children: [] };
    for (let i = 0; i < rows; i++) {
      // We create a row and fill it with cells
      const row: TableRowElement = { type: 'table-row', children: [] };
      for (let j = 0; j < cols; j++) {
        row.children.push(newEmptyCell());
      }
      table.children.push(row);
    }

    // We insert table at selection
    Transforms.insertNodes(editor, [table]);
  },

  /**
   * Remove table near selection
   * @param editor
   */
  removeTable(editor: Editor) {
    Transforms.removeNodes(editor, { match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table' });
  },

  /**
   * Add a row next to current selection
   * @param editor
   */
  addRow(editor: Editor) {
    const [row] = Editor.nodes<TableRowElement>(editor, {
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table-row',
    });

    if (!row) {
      logger.debug('Cannot add row here');
      return;
    }

    const newPath = row[1].slice(0, -1);
    newPath.push(row[1].slice(-1)[0] + 1);

    const cells: TableCellElement[] = [];
    for (let i = 0; i < row[0].children.length; i++) {
      cells.push(newEmptyCell());
    }

    Transforms.insertNodes(
      editor,
      [
        {
          type: 'table-row',
          children: cells,
        },
      ],
      { at: newPath }
    );
  },

  /**
   * Remove row near selection
   * @param editor
   */
  removeRow(editor: Editor) {
    Transforms.removeNodes(editor, { match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table-row' });
  },

  /**
   * Add a col next to current selection
   * @param editor
   */
  addCol(editor: Editor) {
    const [table] = Editor.nodes<TableElement>(editor, {
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table',
    });

    const [cell] = Editor.nodes<TableCellElement>(editor, {
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table-cell',
    });

    if (!cell || !table) {
      logger.debug('Cannot add col here');
      return;
    }

    for (let i = 0; i < table[0].children.length; i++) {
      const newPath = cell[1].slice(0, -2);
      // Row position
      newPath.push(i);
      // New cell position
      newPath.push(cell[1].slice(-1)[0] + 1);

      Transforms.insertNodes(editor, [newEmptyCell()], { at: newPath });
    }
  },

  /**
   * Remove col near selection
   * @param editor
   */
  removeCol(editor: Editor) {
    const [table] = Editor.nodes<TableElement>(editor, {
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table',
    });

    const [cell] = Editor.nodes<TableCellElement>(editor, {
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table-cell',
    });

    if (!table || !cell) {
      logger.debug('Cannot remove cell');
      return;
    }

    const colNumber = cell[1].slice(-1)[0];
    Transforms.removeNodes(editor, {
      match: (n, path) => {
        const isCell = !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table-cell';
        const isTargetCol = path.slice(-1)[0] === colNumber;
        return isCell && isTargetCol;
      },
      at: table[1],
    });
  },

  /**
   * Enable borders of specified level on table
   * @param editor
   * @param size
   */
  setBorders(editor: Editor, size: number) {
    Transforms.setNodes(
      editor,
      {
        type: 'table',
        border: size,
      },
      { match: (n) => Editor.isBlock(editor, n) && n.type === 'table' }
    );
  },
};

function newEmptyCell(): TableCellElement {
  return { type: 'table-cell', children: [{ type: 'paragraph', children: [{ text: '' }] }] };
}
