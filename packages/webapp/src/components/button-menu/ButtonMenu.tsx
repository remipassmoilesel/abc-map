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

import Cls from './ButtonMenu.module.scss';
import { ReactNode, useCallback, useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { WithTooltip } from '../with-tooltip/WithTooltip';
import clsx from 'clsx';

interface Props {
  label: string;
  icon: IconDefinition;
  children: ReactNode;
  onToggle?: (open: boolean) => void;
  className?: string;
  'data-testid'?: string;
  // If true, menu will be closed when user click on popover too
  closeOnClick?: boolean;
}

export function ButtonMenu(props: Props) {
  const { label, icon, children, className, onToggle, 'data-testid': dataTestid, closeOnClick } = props;
  const [open, setOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setOpen(!open);
    onToggle && onToggle(!open);
  }, [onToggle, open]);

  const popover = (
    <Popover>
      <Popover.Header className={clsx(Cls.header, 'abc-menu-popover')}>
        <div>{label}</div>
        <button onClick={handleToggle} className={Cls.closeButton}>
          <FaIcon icon={IconDefs.faTimes} />
        </button>
      </Popover.Header>
      <Popover.Body className={Cls.panel} onClick={closeOnClick ? handleToggle : undefined}>
        {children}
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger trigger={'click'} show={open} onToggle={handleToggle} placement="bottom" overlay={popover}>
      <div className={clsx(Cls.container, className)}>
        <WithTooltip title={label}>
          <button className={Cls.openButton} onClick={handleToggle} data-testid={dataTestid}>
            <FaIcon icon={icon} />
          </button>
        </WithTooltip>
      </div>
    </OverlayTrigger>
  );
}
