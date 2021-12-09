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

import React, { useCallback, useEffect } from 'react';
import { AbcLegendItem, Logger } from '@abc-map/shared';
import LegendPreview from './preview/LegendPreview';
import LegendUpdateForm from './legend-update/LegendUpdateForm';
import { useHistory } from 'react-router-dom';
import { pageSetup } from '../../core/utils/page-setup';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { Routes } from '../../routes';
import { IconDefs } from '../../components/icon/IconDefs';
import { FaIcon } from '../../components/icon/FaIcon';
import { useAppSelector } from '../../core/store/hooks';
import { useServices } from '../../core/hooks';
import Cls from './MapLegendView.module.scss';

const logger = Logger.get('MapLegendView.tsx');

const t = prefixedTranslation('MapLegendView:');

export function MapLegendView() {
  const { project, toasts } = useServices();
  const legend = useAppSelector((st) => st.project.legend);
  const history = useHistory();

  useEffect(() => {
    pageSetup(t('Edit_legend'), t('Create_legend_for_your_map'));
  }, []);

  const handleGoToLayout = useCallback(() => history.push(Routes.layout().format()), [history]);
  const handleSizeChanged = useCallback((width: number, height: number) => project.setLegendSize(width, height), [project]);

  const handleNewItem = useCallback((item: AbcLegendItem) => project.addLegendItems([item]), [project]);
  const handleItemChanged = useCallback((item: AbcLegendItem) => project.updateLegendItem(item), [project]);
  const handleItemDeleted = useCallback((item: AbcLegendItem) => project.deleteLegendItem(item), [project]);

  const moveItem = useCallback(
    (item: AbcLegendItem, diff: number) => {
      const items = legend.items;
      const oldIndex = items.findIndex((i) => i.id === item.id);
      if (oldIndex === -1) {
        logger.error('Item not found: ', { item, diff });
        toasts.genericError();
        return;
      }

      let newIndex = oldIndex + diff;
      if (newIndex < 0) {
        newIndex = 0;
      }
      if (newIndex >= items.length) {
        newIndex = items.length - 1;
      }

      project.setLegendItemIndex(item, newIndex);
    },
    [legend.items, project, toasts]
  );
  const handleItemUp = useCallback((item: AbcLegendItem) => moveItem(item, -1), [moveItem]);
  const handleItemDown = useCallback((item: AbcLegendItem) => moveItem(item, +1), [moveItem]);

  return (
    <div className={Cls.mapLegendView}>
      <div className={'container'}>
        <div className={'row justify-content-end'}>
          {/* Go back button */}
          <div className={'col-sm-4 d-flex justify-content-end'}>
            <button className={'btn btn-outline-primary'} onClick={handleGoToLayout} data-cy={'back-to-layout'}>
              <FaIcon icon={IconDefs.faArrowCircleLeft} className={'mr-2'} />
              {t('Go_back_to_layout')}
            </button>
          </div>
        </div>
        <div className={'row'}>
          {/* Add / update legend items */}
          <div className={'col-xl-6 '}>
            <h1 className={'mt-3 mb-4'}>{t('Edit_legend')}</h1>
            <LegendUpdateForm
              legend={legend}
              onSizeChanged={handleSizeChanged}
              onNewItem={handleNewItem}
              onItemChanged={handleItemChanged}
              onItemDeleted={handleItemDeleted}
              onItemUp={handleItemUp}
              onItemDown={handleItemDown}
            />
          </div>
          {/* Legend preview */}
          <div className={'col-xl-6'}>
            <h4 className={'mt-4 mb-4'}>{t('Preview')}</h4>
            <LegendPreview legend={legend} onSizeChanged={handleSizeChanged} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(MapLegendView);
