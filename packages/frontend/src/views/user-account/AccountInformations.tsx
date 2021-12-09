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

import { withTranslation } from 'react-i18next';
import { prefixedTranslation } from '../../i18n/i18n';
import React from 'react';
import { AbcUser } from '@abc-map/shared';

const t = prefixedTranslation('UserAccountView:');

interface Props {
  user: AbcUser;
}

function AccountInformations(props: Props) {
  const { user } = props;

  return (
    <div className={'card card-body h-100'}>
      <h2 className={'mb-4'}>{t('My_informations')}</h2>
      <div className={'mb-2'}>{t('Email_address')}:</div>
      <input type={'email'} readOnly={true} value={user.email} className={'form-control'} />
      <small className={'mt-2'}>{t('Email_is_readonly')}</small>
      <div className={'mt-4'}>{t('Nothing_more')}</div>
    </div>
  );
}

export default withTranslation()(AccountInformations);
