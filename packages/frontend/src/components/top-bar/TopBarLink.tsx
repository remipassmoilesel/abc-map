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
import { Logger } from '@abc-map/shared';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Cls from './TopBarLink.module.scss';

const logger = Logger.get('TopBarSection.tsx', 'info');

export interface LocalProps {
  to: string;
  activeMatch?: RegExp;
  label: string;
  'data-cy'?: string;
}

export declare type Props = LocalProps & RouteComponentProps<any, any>;

class TopBarLink extends Component<Props, {}> {
  public render(): ReactNode {
    const activeMatch = this.props.activeMatch || this.props.to;
    const active = this.props.location.pathname.match(activeMatch);
    const classes = active ? `${Cls.topBarLink} ${Cls.active}` : Cls.topBarLink;
    const dataCy = this.props['data-cy'];

    return (
      <button onClick={this.handleClick} className={`btn btn-link ${classes}`} data-cy={dataCy}>
        {this.props.label}
      </button>
    );
  }

  private handleClick = () => {
    this.props.history.push(this.props.to);
  };
}

export default withRouter(TopBarLink);
