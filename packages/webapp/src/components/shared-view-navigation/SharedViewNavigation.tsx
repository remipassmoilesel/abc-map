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

import Cls from './SharedViewNavigation.module.scss';
import { prefixedTranslation } from '../../i18n/i18n';
import { WithTooltip } from '../with-tooltip/WithTooltip';
import { FaIcon } from '../icon/FaIcon';
import { IconDefs } from '../icon/IconDefs';
import React, { useCallback } from 'react';
import clsx from 'clsx';
import { useAppSelector } from '../../core/store/hooks';
import { useServices } from '../../core/useServices';

const t = prefixedTranslation('SharedViewNavigation:');

interface Props {
  onNext?: () => void;
  onPrevious?: () => void;
  onMore: () => void;
  className?: string;
}

function SharedViewNavigation(props: Props) {
  const { onNext, onPrevious, onMore, className } = props;
  const { project } = useServices();

  const sharedViews = useAppSelector((st) => st.project.sharedViews.list);
  const activeViewId = useAppSelector((st) => st.project.sharedViews.activeId);
  const activeIndex = sharedViews.findIndex((v) => v.id === activeViewId);
  const hasManyViews = sharedViews.length > 1;
  const hasNext = activeIndex < sharedViews.length - 1;
  const hasPrevious = activeIndex > 0;

  const handlePreviousView = useCallback(() => {
    const newActiveIndex = sharedViews.findIndex((v) => v.id === activeViewId) - 1;
    const newActiveId = sharedViews[newActiveIndex]?.id || sharedViews[sharedViews.length - 1]?.id;
    project.setActiveSharedView(newActiveId);
    onPrevious && onPrevious();
  }, [activeViewId, onPrevious, project, sharedViews]);

  const handleNextView = useCallback(() => {
    const newActiveIndex = sharedViews.findIndex((v) => v.id === activeViewId) + 1;
    const newActiveId = sharedViews[newActiveIndex]?.id || sharedViews[0]?.id;
    project.setActiveSharedView(newActiveId);
    onNext && onNext();
  }, [onNext, activeViewId, project, sharedViews]);

  return (
    <div className={clsx(Cls.navigation, className)}>
      {hasManyViews && (
        <>
          <button onClick={handlePreviousView} disabled={!hasPrevious} title={t('Previous_view')} className={Cls.button}>
            <FaIcon icon={IconDefs.faArrowLeft} size={'1.5rem'} className={Cls.icon} />
          </button>

          <button onClick={handleNextView} disabled={!hasNext} title={t('Next_view')} className={Cls.button}>
            <FaIcon icon={IconDefs.faArrowRight} size={'1.5rem'} className={Cls.icon} />
          </button>
        </>
      )}

      <WithTooltip title={t('More')}>
        <button onClick={onMore} className={Cls.button}>
          <FaIcon icon={IconDefs.faCaretDown} size={'1.5rem'} className={Cls.icon} />
        </button>
      </WithTooltip>
    </div>
  );
}

export default SharedViewNavigation;
