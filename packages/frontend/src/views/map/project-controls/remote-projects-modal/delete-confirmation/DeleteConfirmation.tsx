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

import React from 'react';
import { prefixedTranslation } from '../../../../../i18n/i18n';
import { AbcProjectMetadata } from '@abc-map/shared';
import { FaIcon } from '../../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../../components/icon/IconDefs';

const t = prefixedTranslation('MapView:RemoteProjectsModal.');

interface Props {
  project: AbcProjectMetadata;
  onCancel: () => void;
  onConfirm: () => void;
  disabled: boolean;
}

export function DeleteConfirmation(props: Props) {
  const { project, onCancel, onConfirm, disabled } = props;

  return (
    <div className={'h-100 d-flex flex-column'}>
      <div className={'flex-grow-1 d-flex flex-column align-items-center justify-content-center'}>
        <FaIcon icon={IconDefs.faTrash} size={'5rem'} className={'mb-4'} />
        <h5 className={'mb-5'}>{t('Are_you_sure')}</h5>
        <div className={'text-center'}>
          {t('You_will_permanently_delete')}&nbsp;
          <b>{project.name}</b>
        </div>
      </div>

      <div className={'d-flex justify-content-end'}>
        <button onClick={onCancel} className={'btn btn-secondary mr-3'} data-cy={'cancel-button'}>
          {t('Do_not_delete')}
        </button>
        <button onClick={onConfirm} className={'btn btn-danger'} disabled={disabled} data-cy={'confirm-deletion'}>
          {t('Delete_definitely')}
        </button>
      </div>
    </div>
  );
}
