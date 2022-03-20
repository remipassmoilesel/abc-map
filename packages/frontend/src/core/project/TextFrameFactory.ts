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

import { AbcTextFrame } from '@abc-map/shared';
import { nanoid } from 'nanoid';
import { prefixedTranslation } from '../../i18n/i18n';

const t = prefixedTranslation('core:TextFrameFactory.');

export class TextFrameFactory {
  public static newFrame(): AbcTextFrame {
    return {
      id: nanoid(),
      position: { x: 20, y: 100 },
      size: { width: 800, height: 400 },
      content: [
        { type: 'title', level: 3, children: [{ text: t('This_is_a_brand_new_text_frame') }] },
        { type: 'paragraph', children: [{ text: t('You_can_edit_it_in_full_screen_editor') }] },
        { type: 'paragraph', children: [{ text: t('Or_you_can_edit_it_in_place') }] },
        { type: 'paragraph', children: [{ text: t('You_can_move_and_resize_it') }] },
        { type: 'paragraph', children: [{ text: t('And_you_can_include_images_and_videos') }] },
      ],
    };
  }
}
