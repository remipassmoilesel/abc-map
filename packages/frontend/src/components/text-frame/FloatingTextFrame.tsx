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
import Cls from './FloatingTextFrame.module.scss';
import React, { useCallback, useState } from 'react';
import { AbcTextFrame, Logger, TextFrameChild } from '@abc-map/shared';
import TextEditor from '../text-editor/TextEditor';
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd';
import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';
import { WithTooltip } from '../with-tooltip/WithTooltip';
import { prefixedTranslation } from '../../i18n/i18n';

const logger = Logger.get('TextFrame.tsx');

const t = prefixedTranslation('FloatingTextFrame:');

interface Props {
  frame: AbcTextFrame;
  editable?: boolean;
  ratio?: number;
  // Limits move to parent bound
  bounds?: 'parent';
  onDelete?: (frame: AbcTextFrame) => void;
  onChange?: (before: AbcTextFrame, after: AbcTextFrame) => void;
}

enum FrameDisplay {
  Preview = 'Preview',
  Edition = 'Edition',
}

export function FloatingTextFrame(props: Props) {
  const { frame, ratio: _ratio, editable, onDelete, onChange, bounds } = props;
  const { position, size } = frame;

  const ratio = _ratio ?? 1;
  const [display, setDisplay] = useState(FrameDisplay.Preview);
  const [fullscreenEdition, setFullscreenEdition] = useState(false);

  const handleDragStop: RndDragCallback = useCallback(
    (event, data) => {
      if (!editable) {
        return;
      }

      const updated: AbcTextFrame = {
        ...frame,
        position: {
          x: data.x,
          y: data.y,
        },
      };
      onChange && onChange(frame, updated);
    },
    [editable, frame, onChange]
  );

  const handleResizeStop: RndResizeCallback = useCallback(
    (event, direction, ref, delta, position) => {
      if (!editable) {
        return;
      }

      const updated: AbcTextFrame = {
        ...frame,
        position: {
          x: position.x,
          y: position.y,
        },
        size: {
          width: ref.clientWidth,
          height: ref.clientHeight,
        },
      };
      onChange && onChange(frame, updated);
    },
    [frame, editable, onChange]
  );

  const handleContentChange = useCallback(
    (content: TextFrameChild[]) => {
      if (!editable) {
        return;
      }

      const updated: AbcTextFrame = { ...frame, content };
      onChange && onChange(frame, updated);
    },
    [editable, frame, onChange]
  );

  const handleToggleEdition = useCallback(() => setDisplay(FrameDisplay.Edition === display ? FrameDisplay.Preview : FrameDisplay.Edition), [display]);
  const toggleTitle = FrameDisplay.Edition === display ? t('Preview') : t('Edit');
  const toggleIcon = FrameDisplay.Edition === display ? IconDefs.faEye : IconDefs.faPen;
  const handleToggleFullscreen = useCallback(() => setFullscreenEdition(!fullscreenEdition), [fullscreenEdition]);
  const handleDelete = useCallback(() => onDelete && onDelete(frame), [frame, onDelete]);

  return (
    <>
      <Rnd
        position={position}
        size={size}
        minHeight={100}
        minWidth={100}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        disableDragging={FrameDisplay.Edition === display}
        bounds={bounds}
        data-cy={'floating-text-frame'}
      >
        <div className={Cls.container}>
          <TextEditor ratio={ratio} value={frame.content} onChange={handleContentChange} readOnly={FrameDisplay.Preview === display} controlBar={false} />

          {editable && (
            <div className={Cls.controls}>
              <WithTooltip title={t('Full_screen_editor')}>
                <button onClick={handleToggleFullscreen} data-cy={'toggle-full-screen-editor'}>
                  <FaIcon icon={IconDefs.faExpand} />
                </button>
              </WithTooltip>

              <WithTooltip title={toggleTitle}>
                <button onClick={handleToggleEdition}>
                  <FaIcon icon={toggleIcon} />
                </button>
              </WithTooltip>

              <WithTooltip title={t('Delete')}>
                <button onClick={handleDelete}>
                  <FaIcon icon={IconDefs.faTrash} />
                </button>
              </WithTooltip>
            </div>
          )}
        </div>
      </Rnd>

      {fullscreenEdition && (
        <div className={Cls.fullscreenEditor}>
          <div className={Cls.editorContainer}>
            {/* Large editor */}
            <TextEditor value={frame.content} onChange={handleContentChange} data-cy={'full-screen-editor'} />

            {/* Close button */}
            <button onClick={handleToggleFullscreen} className={Cls.closeButton} data-cy={'close-full-screen-editor'}>
              <FaIcon icon={IconDefs.faTimes} color={'white'} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
