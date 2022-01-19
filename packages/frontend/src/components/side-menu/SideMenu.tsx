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

import React, { CSSProperties, useCallback } from 'react';
import { FaIcon } from '../icon/FaIcon';
import Cls from './SideMenu.module.scss';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { IconDefs } from '../icon/IconDefs';
import { WithTooltip } from '../with-tooltip/WithTooltip';
import { FloatingButton } from '../floating-button/FloatingButton';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../core/store/hooks';
import { UiActions } from '../../core/store/ui/actions';

interface Props {
  title: string;
  titlePlacement?: 'top' | 'right' | 'bottom' | 'left';
  // Menu ID must be a unique identifier of menu. It is used for storing menu state in store (open / closed).
  menuId: string;
  menuPlacement: 'right' | 'left';
  menuWidth?: string;
  menuStyle?: CSSProperties;
  buttonIcon: IconDefinition;
  buttonStyle?: CSSProperties;
  'data-cy'?: string;
  closeOnClick?: boolean;
  children: React.ReactNode;
  initiallyOpened?: boolean;
}

const t = prefixedTranslation('SideMenu:');

function SideMenu(props: Props) {
  const {
    menuId,
    buttonIcon,
    title,
    menuWidth,
    menuStyle,
    titlePlacement,
    children,
    menuPlacement,
    buttonStyle,
    'data-cy': dataCy,
    closeOnClick,
    initiallyOpened,
  } = props;
  const open = useAppSelector((st) => st.ui.sideMenu)[menuId] ?? initiallyOpened ?? false;
  const dispatch = useAppDispatch();

  const handleToggleClick = useCallback(() => dispatch(UiActions.setSideMenuState(menuId, !open)), [dispatch, menuId, open]);
  const handleContentClick = useCallback(() => {
    if (closeOnClick) {
      dispatch(UiActions.setSideMenuState(menuId, false));
    }
  }, [closeOnClick, dispatch, menuId]);

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

            <div className={Cls.menuContent} style={{ width: menuWidth, ...menuStyle }} onClick={handleContentClick}>
              {children}
            </div>
          </div>
        </>
      )}

      {!open && (
        <FloatingButton
          buttonId={`components/SideMenu-${menuId}`}
          icon={buttonIcon}
          title={title}
          onClick={handleToggleClick}
          titlePlacement={titlePlacement}
          style={buttonStyle}
          data-cy={dataCy}
        />
      )}
    </>
  );
}

export default withTranslation()(SideMenu);
