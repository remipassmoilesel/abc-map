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

import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';
import CopyTextFrameModal from '../copy-text-frame-modal/CopyTextFrameModal';
import React, { useCallback, useState } from 'react';
import { AbcTextFrame } from '@abc-map/shared';
import { prefixedTranslation } from '../../i18n/i18n';
import { TextFrameFactory } from '../../core/project/TextFrameFactory';

const t = prefixedTranslation('TextFrameControls:');

interface Props {
  disabled: boolean;
  onAddTextFrame: (frame: AbcTextFrame) => void;
}

export function TextFrameControls(props: Props) {
  const { disabled, onAddTextFrame } = props;
  const [copyFrameModal, showCopyFrameModal] = useState(false);

  const handleNewTextFrame = useCallback(() => onAddTextFrame(TextFrameFactory.newFrame()), [onAddTextFrame]);
  const handleToggleCopyFrameModal = useCallback(() => showCopyFrameModal(!copyFrameModal), [copyFrameModal]);
  const handleCopyFrameConfirm = useCallback((frame: AbcTextFrame) => onAddTextFrame(frame), [onAddTextFrame]);

  return (
    <div className={'control-block'}>
      <div className={'control-item'}>
        <button onClick={handleNewTextFrame} disabled={disabled} className={'btn btn-link'} data-cy={'create-text-frame'}>
          <FaIcon icon={IconDefs.faFont} className={'mr-2'} />
          {t('New_text_frame')}
        </button>
      </div>
      <div className={'control-item'}>
        <button onClick={handleToggleCopyFrameModal} disabled={disabled} className={'btn btn-link'}>
          <FaIcon icon={IconDefs.faCopy} className={'mr-2'} />
          {t('Copy_text_frame')}
        </button>
      </div>

      {copyFrameModal && <CopyTextFrameModal onConfirm={handleCopyFrameConfirm} onCancel={handleToggleCopyFrameModal} />}
    </div>
  );
}
