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

import Cls from './OpenConfirmation.module.scss';
import { FaIcon } from '../../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../../components/icon/IconDefs';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { prefixedTranslation } from '../../../../../i18n/i18n';
import { AbcProjectMetadata } from '@abc-map/shared';

const t = prefixedTranslation('MapView:RemoteProjectsModal.');

interface Props {
  project: AbcProjectMetadata;
  onConfirm: (password: string) => void;
  onCancel: () => void;
  disabled: boolean;
  message?: string;
}

export function OpenConfirmation(props: Props) {
  const { project, onConfirm, onCancel, message, disabled } = props;

  // Password input
  const showPasswordInput = project.containsCredentials && !project.public;
  const [password, setPassword] = useState('');
  const handlePasswordInput = useCallback((ev: ChangeEvent<HTMLInputElement>) => setPassword(ev.target.value), []);

  // Confirmation
  const confirmDisabled = disabled || (showPasswordInput && !password);
  const handleConfirmation = useCallback(() => onConfirm(password), [onConfirm, password]);

  return (
    <div className={'h-100 d-flex flex-column justify-content-center'}>
      <div className={'flex-grow-1 d-flex flex-column align-items-center justify-content-center'}>
        <FaIcon icon={IconDefs.faExclamationTriangle} size={'5rem'} className={'mb-4'} />
        <h5 className={'mb-5'}>{t('Current_changes_will_be_lost')}</h5>

        {showPasswordInput && (
          <div className={Cls.passwordInput}>
            <div>{t('This_project_is_protected_by_a_password')}:</div>
            <input
              type={'password'}
              onInput={handlePasswordInput}
              value={password}
              placeholder={t('Password_of_project')}
              className={'form-control'}
              data-cy={'project-password'}
            />
          </div>
        )}
      </div>

      {message && <div className={'my-3 d-flex justify-content-end'}>{message}</div>}

      <div className={'d-flex justify-content-end'}>
        <button onClick={onCancel} className={'btn btn-secondary mr-3'} data-cy={'cancel-button'}>
          {t('Cancel')}
        </button>
        <button onClick={handleConfirmation} disabled={confirmDisabled} className={'btn btn-primary'} data-cy="open-project-confirm">
          {t('Open_project')}
        </button>
      </div>
    </div>
  );
}
