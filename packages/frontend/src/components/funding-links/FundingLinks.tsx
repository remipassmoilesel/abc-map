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
import PaypalButton from './PaypalButton';
import utipLogo from './utip.png';
import tipeeeLogo from './tipeee.png';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './FundingLinks.module.scss';

const t = prefixedTranslation('FundingLinks:');

class FundingLinks extends React.Component<{}, {}> {
  public render() {
    return (
      <div className={Cls.fundingLinks}>
        <div className={Cls.fundingMedium}>
          <div className={'mb-3'} dangerouslySetInnerHTML={{ __html: t('By_CB_paypal') }} />
          <div className={Cls.logo}>
            <PaypalButton className={Cls.paypalImage} />
          </div>
        </div>

        <div className={Cls.fundingMedium}>
          <div className={'mb-3'} dangerouslySetInnerHTML={{ __html: t('With_utip') }} />
          <div className={Cls.logo}>
            <a href={'https://utip.io/abcmap'} target={'_blank'} rel="noreferrer">
              <img src={utipLogo} alt={'uTip'} className={Cls.utipImage} />
            </a>
          </div>
        </div>

        <div className={Cls.fundingMedium}>
          <div className={'mb-3'} dangerouslySetInnerHTML={{ __html: t('With_tipeee') }} />
          <div className={Cls.logo}>
            <a href={'https://fr.tipeee.com/abc-map'} target={'_blank'} rel="noreferrer">
              <img src={tipeeeLogo} alt={'Tipeee'} className={Cls.tipeeeImage} />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(FundingLinks);
