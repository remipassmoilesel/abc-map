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
import React, { CSSProperties, useCallback, useMemo, useState } from 'react';
import { AbcTextFrame, AbcTextFrameStyle, Logger, TextFrameChild } from '@abc-map/shared';
import TextEditor from '../text-editor/TextEditor';
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd';
import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';
import clsx from 'clsx';
import { FrameControls } from './FrameControls';

const logger = Logger.get('TextFrame.tsx');

interface Props {
  frame: AbcTextFrame;
  readOnly?: boolean;
  // Modify font sizes and dimensions based on this ratio. Useful for static exports.
  ratio?: number;
  // Limits move to parent bound
  bounds?: 'parent';
  onDelete?: (frame: AbcTextFrame) => void;
  onChange?: (before: AbcTextFrame, after: AbcTextFrame) => void;
}

export function FloatingTextFrame(props: Props) {
  const { frame, ratio: _ratio, readOnly, onDelete, onChange, bounds } = props;
  const { position, size, style } = frame;

  const ratio = _ratio ?? 1;
  const [fullscreenEdition, setFullscreenEdition] = useState(false);

  // User drags frame
  const handleDragStop: RndDragCallback = useCallback(
    (event, data) => {
      const updated: AbcTextFrame = {
        ...frame,
        position: {
          x: data.x,
          y: data.y,
        },
      };
      onChange && onChange(frame, updated);
    },
    [frame, onChange]
  );

  // User resizes frame
  const handleResizeStop: RndResizeCallback = useCallback(
    (event, direction, ref, delta, position) => {
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
    [frame, onChange]
  );

  // User change frame content
  const handleContentChange = useCallback(
    (content: TextFrameChild[]) => {
      const updated: AbcTextFrame = { ...frame, content };
      onChange && onChange(frame, updated);
    },
    [frame, onChange]
  );

  // User edits frame in fullscreen
  const handleToggleFullscreen = useCallback(() => setFullscreenEdition(!fullscreenEdition), [fullscreenEdition]);

  // User deletes frame
  const handleDelete = useCallback(() => onDelete && onDelete(frame), [frame, onDelete]);

  // User set frame style
  const handleStyleChange = useCallback(
    (style: AbcTextFrameStyle) => {
      onChange &&
        onChange(frame, {
          ...frame,
          style: {
            ...frame.style,
            ...style,
          },
        });
    },
    [frame, onChange]
  );

  const containerStyle: CSSProperties = useMemo(() => ({ background: style.background }), [style.background]);

  return (
    <>
      <Rnd
        position={position}
        size={size}
        minHeight={60}
        minWidth={100}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        enableResizing={!readOnly}
        disableDragging={readOnly}
        bounds={bounds}
        data-cy={'floating-text-frame'}
      >
        <div
          className={clsx(Cls.container, readOnly && Cls.readonly, style.withShadows && Cls.withShadows, style.withBorders && Cls.withBorders)}
          style={containerStyle}
        >
          <TextEditor
            ratio={ratio}
            value={frame.content}
            onChange={handleContentChange}
            readOnly={true}
            controlBar={false}
            background={frame.style.background}
          />

          {!readOnly && (
            <FrameControls
              frame={frame}
              onDelete={handleDelete}
              onEditFullscreen={handleToggleFullscreen}
              onStyleChange={handleStyleChange}
              className={Cls.controls}
            />
          )}
        </div>
      </Rnd>

      {fullscreenEdition && (
        <div className={Cls.fullscreenEditor}>
          <div className={Cls.editorContainer}>
            {/* Large editor */}
            <TextEditor value={frame.content} onChange={handleContentChange} background={frame.style.background} data-cy={'full-screen-editor'} />

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
