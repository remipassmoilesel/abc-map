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
import { ServiceProps, withServices } from '../../core/withServices';
import { Logger } from '@abc-map/shared';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './ErrorBoundary.module.scss';

const logger = Logger.get('ErrorBoundary');

// Errors with one of these messages are ignored by boundary
const ignoredErrorMessages = [
  // Observed in 03/2022, this error occurs on Chromium when users toggle videos fullscreen, but has no effect
  'ResizeObserver loop limit exceeded',
];

interface State {
  hasError: boolean;
}

const t = prefixedTranslation('ErrorBoundary:');

class ErrorBoundary extends React.Component<ServiceProps, State> {
  constructor(props: ServiceProps) {
    super(props);
    this.state = { hasError: false };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className={Cls.errorScreen}>
          {/* Message */}
          <h1>{t('Aouch')} 😵</h1>
          <div className={'m-5 text-center'} dangerouslySetInnerHTML={{ __html: t('Error_occurred') }} />

          {/* Reload page */}
          <button className={'btn btn-primary mt-4'} onClick={this.handleRefresh}>
            {t('Reload_page')}
          </button>
          <div className={'mb-4 mt-2 text-center'} dangerouslySetInnerHTML={{ __html: t('Recommended_action') }} />

          {/* Return to app */}
          <button className={'btn btn-outline-primary mt-4'} onClick={this.handleClose}>
            {t('Return_to_application')}
          </button>
          <div className={'mb-5 mt-2 text-center'} dangerouslySetInnerHTML={{ __html: t('Application_will_be_unstable') }} />
        </div>
      );
    }

    return this.props.children;
  }

  public componentDidCatch(err: Error | undefined, errorInfo: React.ErrorInfo) {
    logger.error('Unhandled error: ', { error: err, errorInfo, stack: err?.stack || 'Not defined', componentStack: errorInfo.componentStack });

    if (!isErrorIgnored(err)) {
      this.setState({ hasError: true });
    }
  }

  public componentDidMount() {
    window.addEventListener('error', this.handleError);
  }

  public componentWillUnmount() {
    window.removeEventListener('error', this.handleError);
  }

  private handleClose = () => {
    this.setState({ hasError: false });
  };

  private handleRefresh = () => {
    const { storage } = this.props.services;
    storage.clear();
    window.location.reload();
  };

  private handleError = (err: ErrorEvent) => {
    logger.error('Unhandled error: ', err);

    if (!isErrorIgnored(err)) {
      this.setState({ hasError: true });
    }
  };
}

function isErrorIgnored(error: Error | ErrorEvent | undefined): boolean {
  return !!ignoredErrorMessages.find((msg) => error?.message.indexOf(msg) !== -1);
}

export default withTranslation()(withServices(ErrorBoundary));
