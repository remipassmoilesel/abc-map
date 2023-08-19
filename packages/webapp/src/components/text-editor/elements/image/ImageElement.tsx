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

import Cls from './ImageElement.module.scss';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { ImageElement as ImageElementDef } from '@abc-map/shared';
import clsx from 'clsx';
import { IconDefs } from '../../../icon/IconDefs';
import { MouseEvent, useCallback, useState, PointerEvent } from 'react';
import { CustomEditor } from '../../CustomEditor';
import { useEditor } from '../../useEditor';
import { ButtonMenu } from '../../../button-menu/ButtonMenu';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { Action } from '../../../button-menu/Action';
import { Separator } from '../../../button-menu/Separator';
import { createPortal } from 'react-dom';

const t = prefixedTranslation('TextEditor:');

type Props = RenderElementProps & { element: ImageElementDef };

const classes = [Cls.size1, Cls.size2, Cls.size3];

const labels = [t('Small_image'), t('Medium_image'), t('Large_image')];

export function ImageElement(props: Props) {
  const { children, attributes, element } = props;
  const { url, size } = element;
  const { editor, readOnly } = useEditor();
  const [fullscreenPreview, setFullscreenPreview] = useState(false);

  const handleDelete = useCallback(() => {
    const path = ReactEditor.findPath(editor, element);
    CustomEditor.image.delete(editor, path);
  }, [editor, element]);

  const handleImageSize = useCallback(
    (ev: MouseEvent, size: number) => {
      ev.preventDefault();
      ev.stopPropagation();

      const path = ReactEditor.findPath(editor, element);
      CustomEditor.image.setSize(editor, size, path);
    },
    [editor, element]
  );

  const toggleFullScreenPreview = useCallback(
    (ev: MouseEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (!readOnly && !fullscreenPreview) {
        return;
      }

      setFullscreenPreview(!fullscreenPreview);
    },
    [fullscreenPreview, readOnly]
  );

  const handlePointerDown = useCallback((ev: PointerEvent) => {
    ev.stopPropagation();
    ev.preventDefault();
  }, []);

  const sizeClass = classes[size - 1] ?? classes[1];

  return (
    <div className={clsx(Cls.container, sizeClass)} {...attributes}>
      {/* Image itself */}
      <img src={url} alt={url} onClick={toggleFullScreenPreview} onPointerDown={handlePointerDown} className={clsx(Cls.img, readOnly && Cls.readonly)} />

      {/* Image menu, if editable */}
      {!readOnly && (
        <ButtonMenu label={t('Manage_image')} icon={IconDefs.faEllipsisVertical} closeOnClick={true} className={Cls.menu}>
          {/* Image sizes */}
          {[1, 2, 3].map((size) => (
            <Action
              key={size}
              icon={size === 1 ? IconDefs.faUpRightAndDownLeftFromCenter : undefined}
              label={labels[size - 1]}
              onClick={(ev) => handleImageSize(ev, size)}
            />
          ))}

          <Separator />

          {/* Delete image */}
          <Action label={t('Delete_image')} icon={IconDefs.faTrash} onClick={handleDelete} />
        </ButtonMenu>
      )}

      {/* Fullscreen preview */}
      {fullscreenPreview &&
        // We must display modal on body because fixed position may not work due to text editor
        createPortal(
          <div className={Cls.fullscreenModal} onClick={toggleFullScreenPreview}>
            <img src={url} alt={url} className={Cls.largePreview} />
          </div>,
          document.body
        )}

      {children}
    </div>
  );
}
