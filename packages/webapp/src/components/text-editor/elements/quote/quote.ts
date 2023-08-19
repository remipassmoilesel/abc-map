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

export const quote = {
  isActive(editor: Editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === 'quote',
    });

    return !!match;
  },

  toggle(editor: Editor) {
    const isActive = this.isActive(editor);
    Transforms.setNodes(editor, { type: isActive ? undefined : 'quote' }, { match: (n) => Editor.isBlock(editor, n) });
  },
};
