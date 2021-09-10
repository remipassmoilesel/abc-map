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
import Cls from './FundingLinks.module.scss';

export class FundingLinks extends React.Component<{}, {}> {
  public render() {
    return (
      <div className={'d-flex'}>
        <div className={'d-flex flex-column align-items-center mr-5'}>
          <div className={'mb-3'}>
            Par <b>Carte bleue</b> ou <b>Paypal</b>.
          </div>
          <div className={Cls.fundingMedium}>
            <PaypalButton />
          </div>
        </div>
        <div className={'d-flex flex-column align-items-center mr-5'}>
          <div className={'mb-3'}>
            Avec <b>uTip</b>
          </div>
          <div className={Cls.fundingMedium}>
            <a href={'https://utip.io/abcmap'} target={'_blank'} rel="noreferrer">
              <img src={utipLogo} height={'100'} alt={'uTip'} />
            </a>
          </div>
        </div>
        <div className={'d-flex flex-column align-items-center'}>
          <div className={'mb-3'}>
            Avec <b>Tipeee</b>
          </div>
          <div className={Cls.fundingMedium}>
            <a href={'https://fr.tipeee.com/abc-map'} target={'_blank'} rel="noreferrer">
              <img src={tipeeeLogo} height={'70'} alt={'uTip'} />
            </a>
          </div>
        </div>
      </div>
    );
  }
}
