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

import Cls from './EmbedMedia.module.scss';
import { FaIcon } from '../../../icon/FaIcon';
import { IconDefs } from '../../../icon/IconDefs';
import { useCallback, useState } from 'react';
import { useEditor } from '../../useEditor';
import { EmbedMediaModal } from './EmbedMediaModal';
import { CustomEditor } from '../../CustomEditor';
import { WithTooltip } from '../../../with-tooltip/WithTooltip';
import { prefixedTranslation } from '../../../../i18n/i18n';

const t = prefixedTranslation('TextEditor:');

export function EmbedMedia() {
  const { editor } = useEditor();
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const handleEmbedImage = useCallback(
    (url: string) => {
      setOpen(false);
      CustomEditor.image.create(editor, url);
    },
    [editor]
  );

  const handleEmbedVideo = useCallback(
    (url: string) => {
      setOpen(false);
      CustomEditor.video.create(editor, url);
    },
    [editor]
  );

  return (
    <div className={Cls.container}>
      <WithTooltip title={t('Insert_photo_or_video')}>
        <button onClick={handleOpen}>
          <FaIcon icon={IconDefs.faPhotoVideo} />
        </button>
      </WithTooltip>

      {open && <EmbedMediaModal onEmbedImage={handleEmbedImage} onEmbedVideo={handleEmbedVideo} onClose={handleClose} />}
    </div>
  );
}
