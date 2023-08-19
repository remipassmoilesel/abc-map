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

import Cls from './ModuleErrorBoundary.module.scss';
import React, { ReactNode } from 'react';
import { ServiceProps, withServices } from '../../core/withServices';
import { Logger } from '@abc-map/shared';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Routes } from '../../routes';
import { FaIcon } from '../../components/icon/FaIcon';
import { IconDefs } from '../../components/icon/IconDefs';
import { withRouter, WithRouterProps } from '../../core/utils/withRouter';

const logger = Logger.get('ModuleErrorBoundary.tsx');

type Props = ServiceProps & WithRouterProps & WithTranslation & { children: ReactNode | ReactNode[] };

interface State {
  hasError: boolean;
}

class ModuleErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public render() {
    const { t } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return (
        <div className={Cls.content}>
          {/* Message */}
          <h1 className={'mb-3'}>{t('Aouch')} 😵</h1>
          <h5 className={'mb-3 text-center'} dangerouslySetInnerHTML={{ __html: t('Something_went_wrong') }} />

          {/* Return to data processing */}
          <button className={'btn btn-primary mt-4'} onClick={this.handleBackToModuleSearch}>
            <FaIcon icon={IconDefs.faMapSigns} className={'mr-2'} />
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

  private handleBackToModuleSearch = () => {
    const { navigate } = this.props.router;

    this.setState({ hasError: false });
    navigate(Routes.moduleIndex().format());
  };
}

export default withRouter(withTranslation('ModuleView')(withServices(ModuleErrorBoundary)));
