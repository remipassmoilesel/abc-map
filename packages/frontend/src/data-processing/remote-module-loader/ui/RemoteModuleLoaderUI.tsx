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

import Cls from './RemoteModuleLoaderUI.module.scss';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Logger } from '@abc-map/shared';
import { prefixedTranslation } from '../../../i18n/i18n';
import { useServices } from '../../../core/useServices';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import FormValidationLabel from '../../../components/form-validation-label/FormValidationLabel';
import { FormState } from '../../../components/form-validation-label/FormState';
import { ValidationHelper } from '../../../core/utils/ValidationHelper';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { UiActions } from '../../../core/store/ui/actions';
import { LoadingStatus, ModuleLoadingStatus } from '../../ModuleLoadingStatus';

const logger = Logger.get('RemoteModuleLoader.tsx');

interface Props {
  onProcess: () => Promise<ModuleLoadingStatus[]>;
}

const t = prefixedTranslation('DataProcessingModules:RemoteModuleLoader.');

export function RemoteModuleLoaderUI(props: Props) {
  const { onProcess } = props;
  const { toasts } = useServices();
  const dispatch = useAppDispatch();
  const urls = useAppSelector((st) => st.ui.remoteModuleUrls);
  const [formState, setFormState] = useState(FormState.InvalidHttpsUrl);
  const [message, setMessage] = useState('');

  const validate = useCallback((urls: string[]) => {
    let hasError = false;
    for (const url of urls) {
      if (url.trim() && !ValidationHelper.url(url)) {
        hasError = true;
        break;
      }
    }

    if (urls.filter((u) => !!u.trim()).length < 1) {
      hasError = true;
    }

    hasError ? setFormState(FormState.InvalidHttpsUrl) : setFormState(FormState.Ok);
  }, []);

  const handleLoad = useCallback(() => {
    onProcess()
      .then((statusList) => {
        const message = statusList
          .map((st) => {
            if (st.status === LoadingStatus.Succeed) {
              return `${st.url} : Ok`;
            } else {
              return `${st.url} : ${st.error}`;
            }
          })
          .join('\n');

        setMessage(message + '\n' + t('Loading_done'));
      })
      .catch((err) => {
        logger.error('Module loading error: ', err);
        toasts.genericError(err);
      });
  }, [onProcess, toasts]);

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLTextAreaElement>) => {
      const urls = ev.target.value.split('\n');
      dispatch(UiActions.setRemoteModuleUrls(urls));
    },
    [dispatch]
  );

  useEffect(() => validate(urls), [urls, validate]);

  return (
    <div className={Cls.panel}>
      <div className={'mb-2'}>
        <p>{t('You_can_load_data_processing_modules')}</p>
        <p>{t('Enter_a_list_of_adresses')}</p>
      </div>

      <div className={'alert alert-secondary'}>
        <div className={'fw-bold mb-2'}>{t('You_can_write_your_own_data_processing_module')} ✨</div>
        <div>
          <a href={'https://gitlab.com/abc-map/abc-map_private/-/blob/master/documentation/6_modules.md'} target={'_blank'} rel="noreferrer">
            {t('Follow_these_instructions_to_create_a_module')},
          </a>
          &nbsp;{t('modify_it_publish_it_on_Github_or_Gitlab')}
        </div>
        <div>{t('Writing_a_module_requires_advanced_programming_knowledge')}</div>
      </div>

      <div className={'alert alert-danger mt-2 mb-4'}>
        <FaIcon icon={IconDefs.faExclamationTriangle} className={'mr-2'} size={'1.2rem'} />
        {t('Use_only_modules_whose_source_you_know')}
      </div>

      <div>
        <textarea value={urls.join('\n')} onChange={handleChange} rows={5} className={'form-control'} data-cy={'module-urls'} />
      </div>

      <FormValidationLabel state={formState} className={'my-4'} />
      <div className={'d-flex justify-content-end'}>
        <button className={'btn btn-primary mt-3'} onClick={handleLoad} disabled={formState !== FormState.Ok} data-cy={'load-modules'}>
          <FaIcon icon={IconDefs.faGear} className={'mr-2'} />
          {t('Load_modules')}
        </button>
      </div>

      {/* Error or result message */}
      {message && <pre>{message}</pre>}
    </div>
  );
}
