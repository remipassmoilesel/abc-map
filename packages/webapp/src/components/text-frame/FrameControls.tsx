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

import Cls from './FrameControls.module.scss';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { IconDefs } from '../icon/IconDefs';
import { prefixedTranslation } from '../../i18n/i18n';
import { WithTooltip } from '../with-tooltip/WithTooltip';
import { FaIcon } from '../icon/FaIcon';
import clsx from 'clsx';
import { Modal } from 'react-bootstrap';
import { ColorResult, SketchPicker } from 'react-color';
import { AbcTextFrame, AbcTextFrameStyle } from '@abc-map/shared';

const t = prefixedTranslation('FloatingTextFrame:');

interface Props {
  frame: AbcTextFrame;
  onDelete: () => void;
  onEditFullscreen: () => void;
  onStyleChange: (style: AbcTextFrameStyle) => void;
  className?: string;
}

export function FrameControls(props: Props) {
  const { frame, className, onDelete, onEditFullscreen, onStyleChange } = props;
  const { style } = frame;

  const [styleModal, showStyleModal] = useState(false);
  const handleShowSyleModal = useCallback(() => showStyleModal(true), []);

  // Style derived state
  const [background, setBackground] = useState(frame.style.background);
  const [withBorders, setWithBorders] = useState(frame.style.withBorders);
  const [withShadows, setWithShadows] = useState(frame.style.withShadows);

  useEffect(() => {
    setBackground(frame.style.background);
    setWithBorders(frame.style.withBorders);
    setWithShadows(frame.style.withShadows);
  }, [frame.style]);

  // User cancel operation
  const handleStyleCancel = useCallback(() => showStyleModal(false), []);

  // User confirm operation
  const handleStyleConfirm = useCallback(() => {
    onStyleChange({
      ...style,
      background,
      withBorders,
      withShadows,
    });
    showStyleModal(false);
  }, [background, style, onStyleChange, withBorders, withShadows]);

  const withBackground = background !== '#ffffff00';

  // User select a color
  const handleBackgroundChange = useCallback((color: ColorResult, ev: ChangeEvent) => {
    ev.stopPropagation();
    setBackground(color.hex);
  }, []);

  // User wants to enable / disable background
  const handleToggleBackground = useCallback(() => {
    withBackground ? setBackground('#ffffff00') : setBackground('#ffffffff');
  }, [withBackground]);

  // User wants to enable / disable borders
  const handleToggleBorders = useCallback(() => setWithBorders(!withBorders), [withBorders]);

  // User wants to enable / disable shadows
  const handleToggleShadows = useCallback(() => setWithShadows(!withShadows), [withShadows]);

  return (
    <>
      {/* Control bar */}
      <div className={clsx(Cls.controls, className)}>
        <WithTooltip title={t('Full_screen_editor')}>
          <button onClick={onEditFullscreen} data-cy={'toggle-full-screen-editor'}>
            <FaIcon icon={IconDefs.faPen} />
          </button>
        </WithTooltip>

        <WithTooltip title={t('Style_properties')}>
          <button onClick={handleShowSyleModal}>
            <FaIcon icon={IconDefs.faGear} />
          </button>
        </WithTooltip>

        <WithTooltip title={t('Delete')}>
          <button onClick={onDelete}>
            <FaIcon icon={IconDefs.faTrash} />
          </button>
        </WithTooltip>
      </div>

      {/* Frame properties */}
      {styleModal && (
        <Modal show={true} onHide={handleStyleCancel} centered>
          <Modal.Header closeButton>{t('Style_properties')}</Modal.Header>
          <Modal.Body>
            <div className={Cls.styleModal}>
              {/* Left part with options */}
              <div>
                <div className={'mb-2'}>{t('Properties')}</div>
                <div className={Cls.option} onClick={handleToggleBackground}>
                  <input type={'checkbox'} checked={withBackground} onChange={handleToggleBackground} /> {t('With_a_background')}
                </div>
                <div className={Cls.option} onClick={handleToggleBorders}>
                  <input type={'checkbox'} checked={withBorders} onChange={handleToggleBorders} /> {t('With_borders')}
                </div>
                <div className={Cls.option} onClick={handleToggleShadows}>
                  <input type={'checkbox'} checked={withShadows} onChange={handleToggleShadows} /> {t('With_shadows')}
                </div>
              </div>

              {/* Right part with color picker */}
              <SketchPicker color={background} onChange={handleBackgroundChange} disableAlpha={false} width={'20rem'} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={handleStyleCancel} className={'btn btn-outline-secondary'}>
              {t('Cancel')}
            </button>
            <button onClick={handleStyleConfirm} className={'btn btn-primary'}>
              {t('Confirm')}
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}
