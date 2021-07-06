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
import Cls from './ErrorBoundary.module.scss';

const logger = Logger.get('ErrorBoundary');

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ServiceProps, State> {
  constructor(props: ServiceProps) {
    super(props);
    this.state = { hasError: false };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className={Cls.errorScreen}>
          <h1>Aïe Aïe Aïe 😵</h1>
          <div className={'m-5 text-center'}>
            Une erreur empêche l&apos;application de fonctionner correctement. Cet échec a été consigné,
            <br />
            le développeur responsable de cette erreur viens de recevoir sa lettre de démission par email.
          </div>
          <button className={'btn btn-primary mt-4'} onClick={this.handleRefresh}>
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Unhandled React error: ', { error, errorInfo });
    this.setState({ hasError: true });
  }

  public componentDidMount() {
    window.addEventListener('error', this.handleError);
  }

  public componentWillUnmount() {
    window.removeEventListener('error', this.handleError);
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleError = (err: ErrorEvent) => {
    this.props.services.toasts.genericError();
    logger.error('Unhandled error: ', err);
  };
}

export default withServices(ErrorBoundary);
