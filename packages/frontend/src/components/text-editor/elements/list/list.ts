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

import { Logger } from '@abc-map/shared';
import { Editor, Element, Transforms } from 'slate';
import { ListElement } from '../../typings';
import { prefixedTranslation } from '../../../../i18n/i18n';

const logger = Logger.get('list.ts');

const t = prefixedTranslation('TextEditor:');

export const list = {
  create(editor: Editor, ordered: boolean) {
    // We create a table and fill it with rows
    const list: ListElement = { type: 'list', ordered, children: [] };
    for (let i = 0; i < 3; i++) {
      list.children.push({ type: 'list-item', children: [{ text: t('Element') + ' ' + (i + 1) }] });
    }

    // We insert list at selection
    Transforms.insertNodes(editor, [list]);
  },

  /**
   * Remove list near selection
   * @param editor
   */
  removeTable(editor: Editor) {
    Transforms.removeNodes(editor, { match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'list' });
  },
};
