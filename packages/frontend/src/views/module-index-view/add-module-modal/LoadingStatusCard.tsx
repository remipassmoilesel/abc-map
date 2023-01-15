/**
 * Copyright © 2022 Rémi Pace.
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

import clsx from 'clsx';
import { LoadingStatus, ModuleLoadingStatus } from '../../../core/modules/registry/ModuleLoadingStatus';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes } from '../../../routes';
import { useNavigate } from 'react-router-dom';

interface Props {
  status: ModuleLoadingStatus;
}

export function LoadingStatusCard(props: Props) {
  const { status } = props;
  const module = status.module;
  const navigate = useNavigate();
  const { t } = useTranslation('ModuleIndexView', { keyPrefix: 'AddModuleModal' });

  const handleClick = useCallback(() => {
    const moduleId = module?.getId();
    if (moduleId) {
      navigate(Routes.module().withParams({ moduleId }));
    }
  }, [navigate, module]);

  return (
    <div onClick={handleClick} className={'d-flex flex-column shadow-sm p-4 mb-2 cursor-pointer'} data-cy={`open_${module?.getId() || 'NO_ID_FOUND'}`}>
      <div className={'d-flex align-items-start'}>
        <div className={'flex-grow-1'}>{module ? module.getReadableName() : status.url}</div>
        <div className={clsx('badge', status.status === LoadingStatus.Succeed ? 'bg-success' : 'bg-danger')}>
          {status.status === LoadingStatus.Succeed ? t('Ok') : t('Error')}
        </div>
      </div>

      {status.status === LoadingStatus.Failed && <pre className={'my-2'}>Error: {status.error}</pre>}
    </div>
  );
}
