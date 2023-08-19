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

import Cls from './FundingLinks.module.scss';
import React from 'react';
import { PaypalButton } from './PaypalButton';
import { useTranslation } from 'react-i18next';
import BuyMeACoffee from './buymeacoffee.png';

export function FundingLinks() {
  const { t } = useTranslation('FundingLinks');

  return (
    <div className={Cls.fundingLinks}>
      <div className={Cls.fundingMedium}>
        <div className={'mb-3'} dangerouslySetInnerHTML={{ __html: t('By_CB_paypal') }} />
        <div className={Cls.logo}>
          <PaypalButton className={Cls.button} />
        </div>
      </div>

      <div className={Cls.fundingMedium}>
        <div className={'mb-3'} dangerouslySetInnerHTML={{ __html: t('Buy_me_a_coffee') }} />
        <div className={Cls.logo}>
          <a href={'https://www.buymeacoffee.com/remipace'} target={'_blank'} rel="noreferrer">
            <img src={BuyMeACoffee} className={Cls.button} alt={t('Buy_me_a_coffee')} />
          </a>
        </div>
      </div>
    </div>
  );
}
