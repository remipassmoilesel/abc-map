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

import React, { Component, ReactNode } from 'react';
import { ServiceProps, withServices } from '../../core/withServices';
import { pageSetup } from '../../core/utils/page-setup';
import FundingLinks from '../../components/funding-links/FundingLinks';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './FundingView.module.scss';

const t = prefixedTranslation('FundingView:');

class FundingView extends Component<ServiceProps, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.funding}>
        <div className={Cls.content}>
          <h1 className={'mb-3'}>{t('Support_AbcMap')}&nbsp;&nbsp;💌</h1>

          <div className={'w-100'}>
            <h3 className={'my-4'}>{t('Why')} ?</h3>
            <p>{t('AbcMap_is_FOSS')}</p>
            <p>{t('No_ads_no_race_for_attention')} 💪</p>
            <p>{t('Fund_a_free_internet_territory')} 🙏🏻</p>
          </div>

          <div>
            <h3 className={'my-4'}>{t('How')} ?</h3>
            <FundingLinks />
          </div>

          <div className={'w-100'}>
            <h3 className={'my-4'}>{t('What_is_the_point')} ?</h3>
            <p>{t('Money_collected')}:</p>
            <ul>
              <li>{t('Pays_hosting')}</li>
              <li>{t('Funds_development_sessions')}</li>
              <li>{t('Funds_documentation')}</li>
            </ul>

            <p>{t('Next_planned_features_are')}:</p>
            <ul>
              <li>{t('Better_styles')}</li>
              <li>{t('Creating_symbols_from_CSV_workbooks')}</li>
              <li>{t('Counting_geometries_in_polygons')}</li>
              <li>
                <a href={'https://gitlab.com/abc-map/abc-map/-/blob/master/documentation/5_the_bottomless_well.md'} target={'_blank'} rel="noreferrer">
                  {t('And_more')}
                </a>
              </li>
            </ul>
          </div>

          <h3 className="mt-3 mb-3">{t('Links')}</h3>
          <div className="d-flex flex-column">
            <a href="https://twitter.com/abcmapfr" target="_blank" rel="noreferrer">
              🐦 Twitter
            </a>
            <a href="mailto:fr.abcmap@gmail.com" target="_blank" rel="noreferrer">
              📧 Email
            </a>
            <a href="https://gitlab.com/abc-map/abc-map" target="_blank" rel="noreferrer">
              👨‍💻 {t('Source_code')}
            </a>
            <a href="https://remi-pace.fr" target="_blank" rel="noreferrer">
              🌐 {t('Author_personal_website')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  public componentDidMount() {
    pageSetup('Financez Abc-Map', "Financez un petit bout d'Internet libre 💌");
  }
}

export default withTranslation()(withServices(FundingView));
