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

import React, { Component } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import Cls from './FoldableCard.module.scss';

const logger = Logger.get('FoldableCard.tsx', 'info');

interface Props {
  className?: string;
  title: string;
}

interface State {
  isOpen: boolean;
}

class FoldableCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isOpen: true };
  }

  public render() {
    const isOpen = this.state.isOpen;
    const icon = `fa fa-chevron-${isOpen ? 'down' : 'right'}`;
    const toolTip = `${isOpen ? 'Fermer' : 'Ouvrir'} la section`;
    const className = this.props.className;
    const title = this.props.title;

    return (
      <div className={`${Cls.foldableCard} card ${className}`}>
        <div className={Cls.title} onClick={this.toggleCard} title={toolTip}>
          <div>{title}</div>
          <button className="btn btn-link">
            <i className={icon} />
          </button>
        </div>
        {isOpen && <div className={'card-body'}>{this.props.children}</div>}
      </div>
    );
  }

  private toggleCard = () => {
    this.setState((state) => ({ isOpen: !state.isOpen }));
  };
}

export default FoldableCard;
