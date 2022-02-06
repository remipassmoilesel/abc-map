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

import ListItem from './ListItem';
import { AbcSharedView } from '@abc-map/shared';
import { useServices } from '../../../core/useServices';
import { useAppSelector } from '../../../core/store/hooks';
import React, { useCallback, useState } from 'react';
import { IconDefs } from '../../../components/icon/IconDefs';
import { FaIcon } from '../../../components/icon/FaIcon';
import { FloatingButton } from '../../../components/floating-button/FloatingButton';
import Cls from './NavigationMenu.module.scss';
import MainIcon from '../../../assets/main-icon.svg';
import { prefixedTranslation } from '../../../i18n/i18n';

const t = prefixedTranslation('SharedMapView:');

interface Props {
  attributions: string[];
}

function NavigationMenu(props: Props) {
  const { attributions } = props;
  const { project } = useServices();
  const [open, setOpen] = useState(false);

  const sharedViews = useAppSelector((st) => st.project.sharedViews.list);
  const activeViewId = useAppSelector((st) => st.project.sharedViews.activeId);
  const activeIndex = sharedViews.findIndex((v) => v.id === activeViewId);
  const hasNext = activeIndex < sharedViews.length - 1;
  const hasPrevious = activeIndex > 0;

  const handlePreviousView = useCallback(() => {
    const newActiveIndex = sharedViews.findIndex((v) => v.id === activeViewId) - 1;
    const newActiveId = sharedViews[newActiveIndex]?.id || sharedViews[sharedViews.length - 1]?.id;
    project.setActiveSharedView(newActiveId);
  }, [activeViewId, project, sharedViews]);

  const handleNextView = useCallback(() => {
    const newActiveIndex = sharedViews.findIndex((v) => v.id === activeViewId) + 1;
    const newActiveId = sharedViews[newActiveIndex]?.id || sharedViews[0]?.id;
    project.setActiveSharedView(newActiveId);
  }, [activeViewId, project, sharedViews]);

  const handleItemClick = useCallback((view: AbcSharedView) => project.setActiveSharedView(view.id), [project]);

  const handleToggleMenu = useCallback(() => setOpen(!open), [open]);

  return (
    <>
      {/* Navigation closed, we display a button */}
      {!open && (
        <FloatingButton
          buttonId={'shared-map/NavigationMenu'}
          onClick={handleToggleMenu}
          icon={IconDefs.faListOl}
          style={{ top: '50vh', right: '3rem' }}
          title={t('Navigation')}
        />
      )}

      {/* Navigation opened, we display drawer*/}
      {open && (
        <div className={Cls.drawer}>
          <div className={'d-flex align-items-center mb-4'}>
            {/* Previous and next view buttons */}
            <button onClick={handlePreviousView} disabled={!hasPrevious} title={t('Previous_view')} className={`btn btn-outline-secondary ${Cls.navButton}`}>
              <FaIcon icon={IconDefs.faArrowLeft} size={'1rem'} />
            </button>
            <button onClick={handleNextView} disabled={!hasNext} title={t('Next_view')} className={`btn btn-outline-secondary ${Cls.navButton}`}>
              <FaIcon icon={IconDefs.faArrowRight} size={'1rem'} />
            </button>

            <div className={'flex-grow-1'} />

            {/* Close menu button */}
            <button onClick={handleToggleMenu} className={Cls.closeButton}>
              <FaIcon icon={IconDefs.faTimes} size={'1rem'} color={'white'} className={Cls.icon} /> {t('Close')}
            </button>
          </div>

          {/* Views list */}
          <div className={'d-flex flex-column'}>
            {sharedViews.map((view, i) => {
              const active = view.id === activeViewId;
              return <ListItem key={view.id} view={view} index={i + 1} active={active} onClick={handleItemClick} />;
            })}
          </div>

          <div className={'flex-grow-1'} />

          {/* Attributions */}
          <div>
            {attributions.map((attr) => (
              <div key={attr}>{attr}</div>
            ))}
          </div>
          <hr />

          {/* Software credits */}
          <div>{t('This_map_was_created_and_published_with_Abc-Map')}</div>
          <div className={'mb-2'}>{t('Abc-Map_is_free_mapping_software_try_it')}</div>
          <div className={Cls.softwareCredits}>
            <img src={MainIcon} alt={'Logo'} className={Cls.logo} />
            <a href={'/'} target={'_blank'} rel="noreferrer">
              Abc-Map
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export default NavigationMenu;
