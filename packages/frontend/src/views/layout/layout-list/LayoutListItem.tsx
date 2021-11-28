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
import { AbcLayout } from '@abc-map/shared';
import Cls from './LayoutListItem.module.scss';
import { withTranslation } from 'react-i18next';
import { prefixedTranslation } from '../../../i18n/i18n';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';

const logger = Logger.get('LayoutListItem.tsx', 'warn');

interface Props {
  active: boolean;
  layout: AbcLayout;
  onSelected: (lay: AbcLayout) => void;
  onDeleted: (lay: AbcLayout) => void;
}

const t = prefixedTranslation('LayoutView:');

class LayoutListItem extends Component<Props, {}> {
  public render(): ReactNode {
    const layout = this.props.layout;
    const classes = this.props.active ? `${Cls.item} ${Cls.active}` : Cls.item;

    return (
      <div className={classes} onClick={this.handleSelected}>
        <div className={'d-flex align-items-center'}>
          <div className={Cls.layoutName} data-cy={'list-item'}>
            {layout.name}
          </div>
          <button className={'btn btn-sm btn-link'} onClick={this.handleDeleted}>
            <FaIcon icon={IconDefs.faTrash} />
          </button>
        </div>

        <div className={Cls.format}>
          {t('Format')}: {layout.format.width}x{layout.format.height} mm
        </div>
      </div>
    );
  }

  private handleSelected = (): void => {
    this.props.onSelected(this.props.layout);
  };

  private handleDeleted = (): void => {
    this.props.onDeleted(this.props.layout);
  };
}

export default withTranslation()(LayoutListItem);
