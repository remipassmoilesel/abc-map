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

import React, { ReactNode } from 'react';
import { ServiceProps, withServices } from '../../core/withServices';
import { Logger } from '@abc-map/shared';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './ErrorBoundary.module.scss';

const logger = Logger.get('ErrorBoundary');

type Props = ServiceProps & { children: ReactNode | ReactNode[] };

// Errors with one of these messages are ignored by boundary
const ignoredErrorMessages = [
  // Observed in 03/2022, this error occurs on Chromium when users toggle videos fullscreen, but has no effect
  'ResizeObserver loop limit exceeded',
  // This error occurs from time to time on user selection in editor, and no fix have been found
  'Cannot resolve a Slate point from DOM point',
];

interface State {
  hasError: boolean;
}

const t = prefixedTranslation('ErrorBoundary:');

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
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

          {/* Return to app */}
          <button className={'btn btn-primary mt-4'} onClick={this.handleClose}>
            {t('Return_to_application')}
          </button>
          <div className={'mb-5 mt-2 text-center'} dangerouslySetInnerHTML={{ __html: t('Application_will_be_unstable') }} />

          {/* Reload page */}
          <button className={'btn btn-outline-primary mt-4'} onClick={this.handleRefresh}>
            {t('Reload_page')}
          </button>
          <div className={'mb-4 mt-2 text-center'} dangerouslySetInnerHTML={{ __html: t('Recommended_action') }} />
        </div>
      );
    }

    return this.props.children;
  }

  public static getDerivedStateFromError(err: Error | undefined): Partial<State> | null {
    if (!isErrorIgnored(err)) {
      return { hasError: true };
    }

    return null;
  }

  public componentDidCatch(err: Error | undefined, errorInfo: React.ErrorInfo) {
    logger.error('Unhandled error: ', { error: err, errorInfo, stack: err?.stack || 'Not defined', componentStack: errorInfo.componentStack });

    if (!isErrorIgnored(err)) {
      this.setState({ hasError: true });
    }
  }

  private handleClose = () => {
    this.setState({ hasError: false });
  };

  private handleRefresh = () => {
    const { storage } = this.props.services;

    // No need to create a new project here, we will reload page
    storage
      .clear()
      .catch((err) => logger.error('Clear storage error: ', err))
      .finally(() => window.location.reload());
  };
}

function isErrorIgnored(error: Error | ErrorEvent | undefined): boolean {
  return !!ignoredErrorMessages.find((msg) => error?.message.indexOf(msg) !== -1);
}

export default withTranslation()(withServices(ErrorBoundary));
