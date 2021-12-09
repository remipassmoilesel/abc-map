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

import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import { FaIcon } from '../icon/FaIcon';
import Cls from './SideMenu.module.scss';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { IconDefs } from '../icon/IconDefs';
import { WithTooltip } from '../with-tooltip/WithTooltip';
import { FloatingButton } from '../floating-button/FloatingButton';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';

interface Props {
  buttonIcon: IconDefinition;
  title: string;
  titlePlacement?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
  menuPlacement: 'right' | 'left';
  menuWidth?: string;
  buttonStyle?: CSSProperties;
  'data-cy'?: string;
  closeOnClick?: boolean;
}

const t = prefixedTranslation('SideMenu:');

function SideMenu(props: Props) {
  const { buttonIcon, title, menuWidth, titlePlacement, children, menuPlacement, buttonStyle, 'data-cy': dataCy, closeOnClick } = props;
  const [open, setOpen] = useState(false);

  // Close menu on unmount
  useEffect(() => {
    return () => setOpen(false);
  }, []);

  const handleToggleClick = useCallback(() => setOpen(!open), [open]);
  const handleContentClick = useCallback(() => {
    if (closeOnClick) {
      setOpen(false);
    }
  }, [closeOnClick]);

  const menuClasses = `${Cls.menuPanel} ${menuPlacement === 'left' ? Cls.left : Cls.right}`;
  return (
    <>
      {open && (
        <>
          <div className={menuClasses}>
            <WithTooltip title={t('Close')}>
              <button onClick={handleToggleClick} className={Cls.closeButton}>
                <FaIcon icon={IconDefs.faTimes} size={'1.5rem'} color={'white'} className={Cls.icon} />
              </button>
            </WithTooltip>

            <div className={Cls.menuContent} style={{ width: menuWidth }} onClick={handleContentClick}>
              {children}
            </div>
          </div>
        </>
      )}

      {!open && (
        <FloatingButton icon={buttonIcon} title={title} onClick={handleToggleClick} titlePlacement={titlePlacement} style={buttonStyle} data-cy={dataCy} />
      )}
    </>
  );
}

export default withTranslation()(SideMenu);
