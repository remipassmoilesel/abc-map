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

import React, { CSSProperties, MouseEvent, useCallback, useRef } from 'react';
import { FaIcon } from '../icon/FaIcon';
import Cls from './FloatingButton.module.scss';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { WithTooltip } from '../with-tooltip/WithTooltip';
import { Logger } from '@abc-map/shared';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useAppDispatch, useAppSelector } from '../../core/store/hooks';
import { UiActions } from '../../core/store/ui/actions';

const logger = Logger.get('FloatingButton.tsx');

interface Props {
  buttonId: string;
  size?: string;
  icon: IconDefinition;
  title: string;
  titlePlacement?: 'top' | 'right' | 'bottom' | 'left';
  // Style applied on container of button (useful for position e.g.)
  style?: CSSProperties;
  onClick: (ev: MouseEvent) => void;
  disabled?: boolean;
  'data-cy'?: string;
}

export function FloatingButton(props: Props) {
  const { buttonId, icon, size, title, titlePlacement, disabled, style, onClick, 'data-cy': dataCy } = props;
  const nodeRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  // We keep track of dragging in order to decide if we fire click events.
  // We do not fire click events after drag.
  const dragging = useRef(false);
  // Last position of button
  const position = useAppSelector((st) => st.ui.floatingButtons[buttonId]) || [0, 0];

  // We limit drag in order to not permit drag out of window, as there are no means to restore original positions
  const height = window.innerHeight - 130;
  const bounds = { top: -(height / 2), bottom: height / 2, right: 0, left: 0 };
  if (position[1] < bounds.top) {
    position[1] = bounds.top;
  }
  if (position[1] > bounds.bottom) {
    position[1] = bounds.bottom;
  }

  const handleDrag = useCallback(() => {
    dragging.current = true;
  }, []);

  const handleStop = useCallback(
    (ev: DraggableEvent, data: DraggableData) => {
      setTimeout(() => (dragging.current = false), 0);
      dispatch(UiActions.setFloatingButtonPosition(buttonId, data.x, data.y));
    },
    [buttonId, dispatch]
  );

  const handlePointerUp = useCallback(
    (ev: MouseEvent) => {
      if (ev.button !== 0) return;
      if (!dragging.current) {
        onClick(ev);
      }
    },
    [onClick]
  );

  return (
    <Draggable nodeRef={nodeRef} position={{ x: position[0], y: position[1] }} onDrag={handleDrag} onStop={handleStop} bounds={bounds}>
      {/* react-draggable work best with a div element, others are less well supported */}
      <div ref={nodeRef} className={Cls.container} style={style}>
        <WithTooltip title={title} placement={titlePlacement}>
          <button onPointerUp={handlePointerUp} className={Cls.button} data-cy={dataCy} disabled={disabled}>
            <FaIcon icon={icon} size={size || '2rem'} className={Cls.icon} />
          </button>
        </WithTooltip>
      </div>
    </Draggable>
  );
}
