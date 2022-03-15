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

import { Editor, Path, Transforms } from 'slate';
import { ImageElement } from '../../typings';

export const image = {
  create(editor: Editor, url: string) {
    const image: ImageElement = { type: 'image', url, size: 1, children: [{ text: '' }] };
    Transforms.insertNodes(editor, [image]);
  },

  setSize(editor: Editor, size: number, path: Path) {
    Transforms.setNodes(editor, { size }, { at: path });
  },

  delete(editor: Editor, path: Path) {
    Transforms.removeNodes(editor, { at: path });
  },
};
