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

import { AbcTextFrame } from '@abc-map/shared';
import { withTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
import React, { useCallback } from 'react';
import { prefixedTranslation } from '../../i18n/i18n';
import { TextFrameHelpers } from '../../core/project/TextFrameHelpers';
import { useAppSelector } from '../../core/store/hooks';
import Cls from './CopyTextFrameModal.module.scss';

const t = prefixedTranslation('CopyTextFrameModal:');

// TODO: add frames from shared views

interface Props {
  onConfirm: (frame: AbcTextFrame) => void;
  onCancel: () => void;
}

/**
 * This component allows users to select one frame and to copy it in a new frame.
 * @param props
 * @constructor
 */
function CopyTextFrameModal(props: Props) {
  const { onCancel, onConfirm } = props;

  const fromLayouts = useAppSelector((st) => st.project.layouts.list).flatMap((lay, i) => lay.textFrames.map<[AbcTextFrame, number]>((frame) => [frame, i]));
  const fromSharedViews = useAppSelector((st) => st.project.sharedViews.list).flatMap((view, i) =>
    view.textFrames.map<[AbcTextFrame, number]>((frame) => [frame, i])
  );
  const noTextFrames = !fromLayouts.length && !fromSharedViews.length;

  const handleConfirm = useCallback(
    (frame: AbcTextFrame) => {
      const clone = TextFrameHelpers.clone(frame);
      onConfirm({ ...clone, position: { x: 10, y: 10 } });
    },
    [onConfirm]
  );

  return (
    <Modal show={true} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('Copy_text_frame')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={Cls.modal}>
        {noTextFrames && <div className={'text-center mt-5'}>{t('No_frame_to_copy')}</div>}
        {!!fromLayouts.length && (
          <>
            <div className={'mb-3'}>{t('Frames_from_layouts')}</div>
            <div className={'d-flex flex-column align-items-start mb-3'}>
              {fromLayouts.map((frame, i) => (
                <button key={frame[0].id} onClick={() => handleConfirm(frame[0])} className={'btn btn-link'}>
                  {t('Frame_X_from_layout_X', { frame: i + 1, layout: frame[1] + 1 })}
                </button>
              ))}
            </div>
          </>
        )}

        {!!fromSharedViews.length && (
          <>
            <div className={'mb-3'}>{t('Frames_from_shared_views')}</div>
            <div className={'d-flex flex-column align-items-start mb-3'}>
              {fromSharedViews.map((frame, i) => (
                <button key={frame[0].id} onClick={() => handleConfirm(frame[0])} className={'btn btn-link'}>
                  {t('Frame_X_from_shared_view_X', { frame: i + 1, view: frame[1] + 1 })}
                </button>
              ))}
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default withTranslation()(CopyTextFrameModal);
