import clsx from 'clsx';
import { LoadingStatus, ModuleLoadingStatus } from '../../../core/modules/registry/ModuleLoadingStatus';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Routes } from '../../../routes';

interface Props {
  status: ModuleLoadingStatus;
}

export function LoadingStatusCard(props: Props) {
  const { status } = props;
  const module = status.module;

  const { t } = useTranslation('ModuleIndexView', { keyPrefix: 'AddModuleModal' });
  const history = useHistory();

  const handleClick = useCallback(() => {
    const moduleId = module?.getId();
    if (moduleId) {
      history.push(Routes.module().withParams({ moduleId }));
    }
  }, [history, module]);

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
