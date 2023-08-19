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

import { Logger } from '@abc-map/shared';
import { Editor, Element, Range, Transforms } from 'slate';
import { LinkElement } from '@abc-map/shared';

const logger = Logger.get('link.ts');

export const link = {
  /**
   * Get current link under selection, if any
   *
   * First item is slate element, second is text
   */
  getCurrent(editor: Editor): [LinkElement, string] | undefined {
    const [table] = Editor.nodes<LinkElement>(editor, {
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
    });

    if (table && table[0]) {
      return [table[0], table[0].children.map((n) => n.text).join('')];
    }
  },

  /**
   * Create link near current selection
   * @param editor
   * @param text
   * @param url
   */
  create(editor: Editor, text: string, url: string) {
    const isCollapsed = editor.selection && Range.isCollapsed(editor.selection);
    const link: LinkElement = { type: 'link', url, children: [{ text }] };

    if (isCollapsed) {
      Transforms.insertNodes(editor, link);
    } else {
      Transforms.wrapNodes(editor, link, { split: true });
      Transforms.collapse(editor, { edge: 'end' });
    }
  },

  /**
   * Edit specified link
   * @param editor
   * @param element
   * @param text
   * @param url
   */
  edit(editor: Editor, element: LinkElement, text: string, url: string) {
    const [link] = Editor.nodes(editor, { match: (n) => n === element });
    if (!link) {
      return;
    }

    const newLink: LinkElement = { type: 'link', url, children: [{ text }] };

    Transforms.insertNodes(editor, [newLink], { at: link[1] });
    Transforms.removeNodes(editor, { match: (n) => n === link[0] });
  },

  /**
   * Remove link near current selection
   * @param editor
   */
  removeLink(editor: Editor) {
    Transforms.unwrapNodes(editor, {
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
    });
  },
};
