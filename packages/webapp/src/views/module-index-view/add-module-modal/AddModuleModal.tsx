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

import { Modal, ModalBody, ModalHeader } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useServices } from '../../../core/useServices';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { FormState } from '../../../components/form-validation-label/FormState';
import { useOfflineStatus } from '../../../core/pwa/OnlineStatusContext';
import { ValidationHelper } from '../../../core/utils/ValidationHelper';
import { FormOfflineIndicator } from '../../../components/offline-indicator/FormOfflineIndicator';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import FormValidationLabel from '../../../components/form-validation-label/FormValidationLabel';
import { ModuleRegistry } from '../../../core/modules/registry/ModuleRegistry';
import { Logger } from '@abc-map/shared';
import Cls from './AddModuleModal.module.scss';
import { ModuleLoadingStatus } from '../../../core/modules/registry/ModuleLoadingStatus';
import clsx from 'clsx';
import { useSearchParamsModuleUrls } from '../hooks';
import { LoadingStatusCard } from './LoadingStatusCard';
import uniq from 'lodash/uniq';

const logger = Logger.get('AddModuleModal.tsx');

export interface Props {
  onHide: () => void;
}

export function AddModuleModal(props: Props) {
  const { onHide } = props;
  const { t } = useTranslation('ModuleIndexView', { keyPrefix: 'AddModuleModal' });
  const { toasts } = useServices();
  const registry = ModuleRegistry.get();
  const offline = useOfflineStatus();

  const [loading, setLoading] = useState(false);

  const [formState, setFormState] = useState(FormState.InvalidHttpsUrl);
  const [statuses, setStatuses] = useState<ModuleLoadingStatus[]>([]);

  const searchParamsUrls = useSearchParamsModuleUrls();
  const [remoteUrls, setRemoteUrls] = useState<string[]>(searchParamsUrls);

  const handleLoadModules = useCallback(() => {
    const uniqUrls = uniq(remoteUrls);

    setLoading(true);
    registry
      .loadRemoteModules(uniqUrls)
      .then((statuses) => setStatuses(statuses))
      .catch((err) => {
        logger.error('Module loading error: ', err);
        toasts.genericError(err);
      })
      .finally(() => setLoading(false));
  }, [registry, remoteUrls, toasts]);

  const handleChange = useCallback((ev: ChangeEvent<HTMLTextAreaElement>) => setRemoteUrls(ev.target.value.split('\n')), []);

  // Validate URLs each time they change
  useEffect(() => {
    let hasError = false;
    for (const url of remoteUrls) {
      if (url.trim() && !ValidationHelper.url(url)) {
        hasError = true;
        break;
      }
    }

    if (remoteUrls.filter((u) => !!u.trim()).length < 1) {
      hasError = true;
    }

    hasError ? setFormState(FormState.InvalidHttpsUrl) : setFormState(FormState.Ok);
  }, [remoteUrls]);

  return (
    <Modal show={true} onHide={onHide}>
      <ModalHeader closeButton>
        <h3>{t('Add_a_module')}</h3>
      </ModalHeader>

      <ModalBody className={Cls.modalBody}>
        <div className={'mb-2'}>{t('Enter_module_addresses_then_confirm')}</div>

        <FormOfflineIndicator />

        <textarea value={remoteUrls.join('\n')} onChange={handleChange} disabled={offline} rows={5} className={'form-control mb-3'} data-cy={'module-urls'} />

        <div className={clsx(Cls.example, 'alert alert-info')}>
          {t('You_can_try')}&nbsp;<code>https://abc-map.gitlab.io/module-template/</code>
        </div>

        {!offline && (
          <div className={'alert alert-danger mt-2 mb-4'}>
            <FaIcon icon={IconDefs.faExclamationTriangle} className={'mr-2'} size={'1.2rem'} />
            {t('Use_only_modules_whose_source_you_know')}
          </div>
        )}

        <FormValidationLabel state={formState} className={'my-4 ml-3'} />

        <div className={'d-flex justify-content-end mb-4'}>
          <button onClick={onHide} disabled={loading} className={'btn btn-outline-secondary mr-2'} data-cy={'close-modal'}>
            {t('Close')}
          </button>

          <button
            onClick={handleLoadModules}
            disabled={formState !== FormState.Ok || offline || loading}
            className={'btn btn-primary'}
            data-cy={'load-modules'}
          >
            <FaIcon icon={IconDefs.faGear} className={'mr-2'} />
            {t('Load_modules')}
          </button>
        </div>

        {/* Error or result message */}
        {!!statuses.length && (
          <div className={'p-2'}>
            <div className={'fw-bold mb-3'}>{t('Modules_loaded')}</div>

            {statuses.map((status) => (
              <LoadingStatusCard key={status.url} status={status} />
            ))}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}
