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

import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  foregroundColor?: string;
  backgroundColor?: string;
};

export type CustomElement =
  | ParagraphElement
  | CodeElement
  | QuoteElement
  | TitleElement
  | TableElement
  | TableRowElement
  | TableCellElement
  | VideoElement
  | ImageElement
  | ListElement
  | ListItemElement
  | LinkElement;

export interface ParagraphElement {
  type: 'paragraph';
  align?: TextAlign;
  children: CustomText[];
}

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export interface CodeElement {
  type: 'code';
  children: CustomText[];
}

export interface QuoteElement {
  type: 'quote';
  children: CustomText[];
}

export interface TitleElement {
  type: 'title';
  level: number;
  children: CustomText[];
}

export interface TableElement {
  type: 'table';
  children: TableRowElement[];
  border?: number;
}

export interface TableRowElement {
  type: 'table-row';
  children: TableCellElement[];
}

export interface TableCellElement {
  type: 'table-cell';
  // We must use paragraph inside tables, otherwise we can not have multiple lines cells
  children: ParagraphElement[];
}

export interface VideoElement {
  type: 'video';
  url: string;
  // Content is not editable
  children: [{ text: '' }];
}

export interface ImageElement {
  type: 'image';
  url: string;
  size: number;
  // Content is not editable
  children: [{ text: '' }];
}

export interface ListElement {
  type: 'list';
  ordered: boolean;
  children: ListItemElement[];
}

export interface ListItemElement {
  type: 'list-item';
  children: CustomText[];
}

export interface LinkElement {
  type: 'link';
  url: string;
  children: CustomText[];
}
