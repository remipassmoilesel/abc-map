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

import { Editor, Element, Range, Transforms } from 'slate';
import { ListElement, ListItemElement, ParagraphElement } from '../../typings';

export const withLists = (editor: Editor) => {
  const { insertBreak } = editor;

  /**
   * With lists, if user type two empty lines at the end of the list, we must terminate list.
   * @param args
   */
  editor.insertBreak = (...args) => {
    const { selection } = editor;

    // We check if current selection is in a list item
    if (selection && Range.isCollapsed(selection)) {
      const [list] = Editor.nodes<ListElement>(editor, {
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'list',
      });

      const [listItem] = Editor.nodes<ListItemElement>(editor, {
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'list-item',
      });

      if (list && listItem) {
        // If we are in list item, and the last item of list is empty, we delete last item
        // Then add and focus a new paragraph
        const last = list[0].children[list[0].children.length - 1];
        const inLast = last === listItem[0];
        const lastIsEmpty = !last.children.map((n) => n.text).join('');

        if (inLast && lastIsEmpty) {
          Transforms.removeNodes(editor, { match: (n) => n === last });

          const paragraph: ParagraphElement = { type: 'paragraph', children: [{ text: '' }] };
          const path = list[1].slice();
          path[path.length - 1]++;
          Transforms.insertNodes(editor, [paragraph], { at: path });

          Transforms.setSelection(editor, {
            focus: { path, offset: 0 },
            anchor: { path, offset: 0 },
          });
          return;
        }
      }
    }

    insertBreak(...args);
  };

  return editor;
};
