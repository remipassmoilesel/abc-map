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
import Cls from './ModuleErrorBoundary.module.scss';
import { ServiceProps, withServices } from '../../core/withServices';
import { Logger } from '@abc-map/shared';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Routes } from '../../routes';

const logger = Logger.get('ModuleErrorBoundary');

type Props = ServiceProps & RouteComponentProps;

interface State {
  hasError: boolean;
}

const t = prefixedTranslation('DataProcessingView:');

class ModuleErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className={Cls.content}>
          {/* Message */}
          <h1>{t('Aouch')} 😵</h1>
          <div className={'mb-3 text-center'} dangerouslySetInnerHTML={{ __html: t('Module_crashed') }} />

          {/* Return to data processing */}
          <button className={'btn btn-primary mt-4'} onClick={this.handleBackToIndex}>
            {t('Back_to_index')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }

  public static getDerivedStateFromError(err: Error | undefined): Partial<State> | null {
    logger.error('Unhandled error: ', err);
    return { hasError: true };
  }

  public componentDidCatch(err: Error | undefined, errorInfo: React.ErrorInfo) {
    logger.error('Unhandled error: ', { error: err, errorInfo, stack: err?.stack || 'Not defined', componentStack: errorInfo.componentStack });
    this.setState({ hasError: true });
  }

  private handleBackToIndex = () => {
    const { history } = this.props;

    this.setState({ hasError: false });
    history.push(Routes.dataProcessing().format());
  };
}

export default withRouter(withTranslation()(withServices(ModuleErrorBoundary)));
