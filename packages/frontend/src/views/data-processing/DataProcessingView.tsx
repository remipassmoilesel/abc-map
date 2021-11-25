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
import { DataProcessingParams, Logger } from '@abc-map/shared';
import { getModules } from '../../data-processing';
import { Link, RouteComponentProps } from 'react-router-dom';
import { pageSetup } from '../../core/utils/page-setup';
import { prefixedTranslation } from '../../i18n/i18n';
import { Routes } from '../../routes';
import { withTranslation } from 'react-i18next';
import Cls from './DataProcessingView.module.scss';
import '../../data-processing/style.scss';

const logger = Logger.get('DataProcessingView.tsx');

declare type Props = RouteComponentProps<DataProcessingParams, any>;

// Modules must be kept in memory
const Modules = getModules();

const t = prefixedTranslation('DataProcessingView:');
const tModules = prefixedTranslation('DataProcessingModules:');

class DataProcessingView extends Component<Props, {}> {
  public render(): ReactNode {
    const currentModuleId = this.props.match.params.moduleId;
    const module = Modules.find((mod) => mod.getId() === currentModuleId);

    return (
      <div className={Cls.dataProcessingView}>
        <div className={Cls.leftMenu}>
          <div className={'mx-2 my-4 fw-bold'}>Modules</div>
          {Modules.map((mod) => (
            <Link key={mod.getId()} className={'btn btn-link mb-1'} to={Routes.dataProcessing().withParams({ moduleId: mod.getId() })} data-cy={mod.getId()}>
              {tModules(mod.getI18nName())}
            </Link>
          ))}
        </div>
        <div className={Cls.viewPort} data-cy={'data-processing-viewport'}>
          {module && (
            <>
              <h4>{tModules(module.getI18nName())}</h4>
              {module.getUserInterface()}
            </>
          )}
          {!module && (
            <div className={Cls.welcome}>
              <i className={'fa fa-cogs'} />
              <h4 dangerouslySetInnerHTML={{ __html: t('Select_a_module_on_left') }} />
            </div>
          )}
        </div>
      </div>
    );
  }

  public componentDidMount() {
    pageSetup(t('Data_processing'), t('Visualize_data_on_map'));
  }
}

export default withTranslation()(DataProcessingView);
