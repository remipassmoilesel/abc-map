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
  return <Leaf {...props}>{props.children}</Leaf>;
}

export function renderElement(props: RenderElementProps) {
  switch (props.element.type) {
    case 'code':
      return <CodeElement {...props}>{props.children}</CodeElement>;
    case 'quote':
      return (
        <QuoteElement {...props} element={props.element}>
          {props.children}
        </QuoteElement>
      );
    case 'title':
      return (
        <TitleElement {...props} element={props.element}>
          {props.children}
        </TitleElement>
      );
    case 'table':
      return (
        <TableElement {...props} element={props.element}>
          {props.children}
        </TableElement>
      );
    case 'table-row':
      return (
        <TableRowElement {...props} element={props.element}>
          {props.children}
        </TableRowElement>
      );
    case 'table-cell':
      return (
        <TableCellElement {...props} element={props.element}>
          {props.children}
        </TableCellElement>
      );
    case 'video':
      return (
        <VideoElement {...props} element={props.element}>
          {props.children}
        </VideoElement>
      );
    case 'image':
      return (
        <ImageElement {...props} element={props.element}>
          {props.children}
        </ImageElement>
      );
    case 'list':
      return (
        <ListElement {...props} element={props.element}>
          {props.children}
        </ListElement>
      );
    case 'list-item':
      return (
        <ListItemElement {...props} element={props.element}>
          {props.children}
        </ListItemElement>
      );
    case 'link':
      return (
        <LinkElement {...props} element={props.element}>
          {props.children}
        </LinkElement>
      );
    case 'map-symbol':
      return (
        <MapSymbolElement {...props} element={props.element}>
          {props.children}
        </MapSymbolElement>
      );

    case 'paragraph':
    default:
      return <ParagraphElement {...props}>{props.children}</ParagraphElement>;
  }
}
