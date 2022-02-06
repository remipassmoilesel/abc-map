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

import { useAppSelector } from '../../../../core/store/hooks';
import { IconDefs } from '../../../../components/icon/IconDefs';
import { useCallback } from 'react';
import { useServices } from '../../../../core/useServices';
import { FaIcon } from '../../../../components/icon/FaIcon';
import SharedViewListItem from './SharedViewListItem';
import { AbcSharedView, Logger } from '@abc-map/shared';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { WithTooltip } from '../../../../components/with-tooltip/WithTooltip';
import { RemoveSharedViewsChangeset } from '../../../../core/history/changesets/shared-views/RemoveSharedViewsChangeset';
import { HistoryKey } from '../../../../core/history/HistoryKey';
import { UpdateSharedViewsChangeset } from '../../../../core/history/changesets/shared-views/UpdateSharedViewChangeset';
import Cls from './SharedViewList.module.scss';

const logger = Logger.get('SharedViewList');

const t = prefixedTranslation('ShareSettingsView:');

interface Props {
  onNewView: () => void;
}

function SharedViewList(props: Props) {
  const { project, history, toasts } = useServices();
  const sharedViews = useAppSelector((st) => st.project.sharedViews.list);
  const activeViewId = useAppSelector((st) => st.project.sharedViews.activeId);
  const activeIndex = sharedViews.findIndex((v) => v.id === activeViewId);
  const hasNext = activeIndex < sharedViews.length - 1;
  const hasPrevious = activeIndex > 0;
  const handleNewView = props.onNewView;

  const handleItemClick = useCallback((view: AbcSharedView) => project.setActiveSharedView(view.id), [project]);

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

  const handleDeleteView = useCallback(
    (view: AbcSharedView) => {
      if (sharedViews.length < 2) {
        toasts.info(t('You_cannot_delete_the_last_view'));
        return;
      }

      const cs = RemoveSharedViewsChangeset.create([view]);
      cs.apply()
        .then(() => history.register(HistoryKey.SharedViews, cs))
        .catch((err) => logger.error('Cannot delete view: ', err));
    },
    [history, sharedViews.length, toasts]
  );

  const handleUpateView = useCallback(
    (before: AbcSharedView, after: AbcSharedView) => {
      const cs = UpdateSharedViewsChangeset.create([{ before, after }]);
      cs.apply()
        .then(() => history.register(HistoryKey.SharedViews, cs))
        .catch((err) => logger.error('Cannot delete view: ', err));
    },
    [history]
  );

  return (
    <div className={'d-flex flex-column'}>
      {/* Previous and next view buttons */}
      <div className={'d-flex justify-content-end align-items-center p-3 mb-3'}>
        <WithTooltip title={t('Previous_view')}>
          <button onClick={handlePreviousView} disabled={!hasPrevious} className={`btn btn-outline-secondary ${Cls.btn}`}>
            <FaIcon icon={IconDefs.faArrowLeft} size={'1.1rem'} />
          </button>
        </WithTooltip>

        <WithTooltip title={t('Next_view')}>
          <button onClick={handleNextView} disabled={!hasNext} className={`btn btn-outline-secondary ${Cls.btn}`}>
            <FaIcon icon={IconDefs.faArrowRight} size={'1.1rem'} />
          </button>
        </WithTooltip>
      </div>

      {/* Views list */}
      <div>
        {sharedViews.map((view) => {
          const active = view.id === activeViewId;
          return (
            <SharedViewListItem key={view.id} view={view} active={active} onClick={handleItemClick} onDelete={handleDeleteView} onUpdate={handleUpateView} />
          );
        })}
      </div>

      {/* New view */}
      <div className={'d-flex justify-content-end align-items-center p-3 mb-3'}>
        <WithTooltip title={t('New_view')}>
          <button onClick={handleNewView} className={`btn btn-link`}>
            <FaIcon icon={IconDefs.faPlus} size={'1.1rem'} className={'mr-2'} /> {t('New_view')}
          </button>
        </WithTooltip>
      </div>
    </div>
  );
}

export default SharedViewList;
