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

import React, { Component, ReactNode } from 'react';
import { withTranslation } from 'react-i18next';
import { prefixedTranslation } from '../../i18n/i18n';
import { IconDefs } from '../icon/IconDefs';
import { FaIcon } from '../icon/FaIcon';
import Cls from './FoldingCard.module.scss';

interface Props {
  className?: string;
  title: string;
  children: ReactNode | ReactNode[];
}

interface State {
  isOpen: boolean;
}

const t = prefixedTranslation('FoldingCard:');

class FoldingCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isOpen: true };
  }

  public render() {
    const isOpen = this.state.isOpen;
    const toolTip = isOpen ? t('Close') : t('Open');
    const className = this.props.className;
    const title = this.props.title;

    return (
      <div className={`${Cls.FoldingCard} card ${className}`}>
        <div className={Cls.title} onClick={this.toggleCard} title={toolTip}>
          <div>{title}</div>
          <button className="btn btn-link">
            {isOpen && <FaIcon icon={IconDefs.faChevronDown} />}
            {!isOpen && <FaIcon icon={IconDefs.faChevronRight} />}
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

export default withTranslation()(FoldingCard);
