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
import { FundingLinks } from '../../components/funding-links/FundingLinks';
import Cls from './FundingView.module.scss';

class FundingView extends Component<ServiceProps, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.funding}>
        <div className={Cls.content}>
          <h1 className={'mb-3'}>Soutenez le développement d&apos;Abc-Map&nbsp;&nbsp;💌</h1>

          <div className={'w-100'}>
            <h3 className={'my-4'}>Pourquoi ?</h3>
            <p>Abc-Map est un logiciel libre développé et hébergé bénévolement.</p>
            <p>Vous avez remarqué ? Pas de pub, pas de course à l&apos;attention, pas de récolte de données personnelles 💪</p>
            <p>
              En finançant ce logiciel vous financez un territoire d&apos;internet libre, où le logiciel sert l&apos;utilisateur. Ça pourrait bien devenir une
              &nbsp;norme un jour 🙏🏻
            </p>
          </div>

          <div>
            <h3 className={'my-4'}>Comment ?</h3>
            <FundingLinks />
          </div>

          <div className={'w-100'}>
            <h3 className={'my-4'}>A quoi ça sert ?</h3>
            <p>L&apos;argent récolté:</p>
            <ul>
              <li>paie l&apos;hébergement</li>
              <li>finance des sessions de développement</li>
              <li>finance de la documentation</li>
            </ul>

            <p>Les prochaines fonctionnalités prévues sont:</p>
            <ul>
              <li>De meilleurs styles pour créer de plus belles cartes</li>
              <li>La création de symboles à partir de classeurs CSV</li>
              <li>Le compte de géométries dans des polygones</li>
              <li>La traduction en plusieurs langues</li>
              <li>
                Et plus !{' '}
                <a href={'https://gitlab.com/abc-map/abc-map/-/blob/master/documentation/5_the_bottomless_well.md'} target={'_blank'} rel="noreferrer">
                  Voir ici
                </a>
              </li>
            </ul>
          </div>

          <h3 className="mt-3 mb-3">Liens</h3>
          <div className="d-flex flex-column">
            <a href="https://twitter.com/abcmapfr" target="_blank" rel="noreferrer">
              🐦 Twitter
            </a>
            <a href="mailto:fr.abcmap@gmail.com" target="_blank" rel="noreferrer">
              📧 Contact
            </a>
            <a href="https://gitlab.com/abc-map/abc-map" target="_blank" rel="noreferrer">
              👨‍💻 Code source
            </a>
            <a href="https://remi-pace.fr" target="_blank" rel="noreferrer">
              🌐 Site personnel de l&apos;auteur
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

export default withServices(FundingView);
