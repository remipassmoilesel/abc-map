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

import ListItem from './ListItem';
import { AbcSharedView } from '@abc-map/shared';
import { useServices } from '../../../core/useServices';
import { useAppSelector } from '../../../core/store/hooks';
import React, { useCallback } from 'react';
import { IconDefs } from '../../../components/icon/IconDefs';
import { FaIcon } from '../../../components/icon/FaIcon';
import Cls from './NavigationMenu.module.scss';
import MainIcon from '../../../assets/main-icon.svg';
import { useActiveSharedView } from '../../../core/project/useActiveSharedView';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

interface Props {
  onClose: () => void;
  onRestoreView: () => void;
  onDownload: () => void;
  className?: string;
}

function NavigationMenu(props: Props) {
  const { onClose, onRestoreView, onDownload, className } = props;
  const { project } = useServices();
  const { t } = useTranslation('SharedMapView');

  const sharedViews = useAppSelector((st) => st.project.sharedViews.list);
  const activeView = useActiveSharedView();

  const handleItemClick = useCallback(
    (view: AbcSharedView) => {
      project.setActiveSharedView(view.id);
      onClose();
    },
    [onClose, project]
  );

  return (
    <div className={clsx(Cls.navigationMenu, className)}>
      <div className={'d-flex align-items-end mb-3'}>
        <h5 className={'flex-grow-1'}>{t('Views')}</h5>

        <button onClick={onClose} className={Cls.closeButton}>
          <FaIcon icon={IconDefs.faTimes} size={'1rem'} color={'white'} className={Cls.icon} /> {t('Close')}
        </button>
      </div>

      {/* Views list */}
      <div className={'d-flex flex-column'}>
        {sharedViews.map((view) => {
          const active = view.id === activeView?.id;
          return <ListItem key={view.id} view={view} active={active} onClick={handleItemClick} />;
        })}
      </div>

      <div className={'flex-grow-1'} />

      <h5>{t('Actions')}</h5>

      <div className={'control-block mb-4'}>
        {/* Restore original view */}
        <div className={'control-item'}>
          <button onClick={onRestoreView} className={'btn btn-link d-flex align-items-center'}>
            <FaIcon icon={IconDefs.faArrowsToCircle} size={'1.2rem'} className={'mr-2'} /> {t('Map_at_its_original_position')}
          </button>
        </div>

        {/* Download project */}
        <div className={'control-item'}>
          <button onClick={onDownload} className={'btn btn-link d-flex align-items-center'}>
            <FaIcon icon={IconDefs.faDownload} size={'1.2rem'} className={'mr-2'} /> {t('Download_data')}
          </button>
        </div>
      </div>

      {/* Software credits */}
      <div>{t('This_map_was_created_and_published_with_Abc-Map')}</div>
      <div className={'mb-2'}>{t('Abc-Map_is_free_mapping_software_try_it')}</div>
      <div className={Cls.softwareCredits}>
        <img src={MainIcon} alt={'Abc-Map'} className={Cls.logo} />
        <a href={'/'} target={'_blank'} rel="noreferrer">
          Abc-Map
        </a>
      </div>
    </div>
  );
}

export default NavigationMenu;
