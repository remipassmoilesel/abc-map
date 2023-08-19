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

import { CodeElement } from './elements/code/CodeElement';
import { RenderElementProps, RenderLeafProps } from 'slate-react';
import { ParagraphElement } from './elements/paragraph/ParagraphElement';
import { TitleElement } from './elements/title/TitleElement';
import { Leaf } from './leaf/Leaf';
import { QuoteElement } from './elements/quote/QuoteElement';
import { TableElement } from './elements/table/TableElement';
import { TableRowElement } from './elements/table/TableRowElement';
import { TableCellElement } from './elements/table/TableCellElement';
import { VideoElement } from './elements/video/VideoElement';
import { ImageElement } from './elements/image/ImageElement';
import { ListElement } from './elements/list/ListElement';
import { ListItemElement } from './elements/list/ListItemElement';
import { LinkElement } from './elements/link/LinkElement';
import { MapSymbolElement } from './elements/map-symbol/MapSymbolElement';

export function renderLeaf(props: RenderLeafProps) {
  return <Leaf {...props} />;
}

export function renderElement(props: RenderElementProps) {
  const { element } = props;

  switch (element.type) {
    case 'code':
      return <CodeElement {...props} element={element} />;
    case 'quote':
      return <QuoteElement {...props} element={element} />;
    case 'title':
      return <TitleElement {...props} element={element} />;
    case 'table':
      return <TableElement {...props} element={element} />;
    case 'table-row':
      return <TableRowElement {...props} element={element} />;
    case 'table-cell':
      return <TableCellElement {...props} element={element} />;
    case 'video':
      return <VideoElement {...props} element={element} />;
    case 'image':
      return <ImageElement {...props} element={element} />;
    case 'list':
      return <ListElement {...props} element={element} />;
    case 'list-item':
      return <ListItemElement {...props} element={element} />;
    case 'link':
      return <LinkElement {...props} element={element} />;
    case 'map-symbol':
      return <MapSymbolElement {...props} element={element} />;

    case 'paragraph':
    default:
      return <ParagraphElement {...props} element={element} />;
  }
}
