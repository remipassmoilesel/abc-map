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

import { bold } from './marks/bold';
import { code } from './elements/code/code';
import { title } from './elements/title/title';
import { foregroundColor } from './marks/foreground-color';
import { underline } from './marks/underline';
import { italic } from './marks/italic';
import { quote } from './elements/quote/quote';
import { backgroundColor } from './marks/background-color';
import { table } from './elements/table/table';
import { video } from './elements/video/video';
import { Editor, Element, Text, Transforms } from 'slate';
import { image } from './elements/image/image';
import { align } from './marks/align';
import { list } from './elements/list/list';
import { link } from './elements/link/link';
import { mapSymbol } from './elements/map-symbol/map-symbol';
import { size } from './marks/size';

export const CustomEditor = {
  bold,
  italic,
  underline,
  code,
  quote,
  title,
  foregroundColor,
  backgroundColor,
  table,
  video,
  image,
  align,
  list,
  link,
  mapSymbol,
  size,
  setParagraph(editor: Editor) {
    Transforms.setNodes(editor, { type: 'paragraph' }, { match: (n) => Element.isElement(n), split: true });
  },
  clearStyle(editor: Editor) {
    const properties = {
      type: undefined,
      size: undefined,
      bold: undefined,
      italic: undefined,
      underline: undefined,
      foregroundColor: undefined,
      backgroundColor: undefined,
    };

    Transforms.setNodes(editor, properties, { match: (n) => Text.isText(n), split: true });
    Transforms.setNodes(editor, properties, { match: (n) => Element.isElement(n), split: true });
  },
};
