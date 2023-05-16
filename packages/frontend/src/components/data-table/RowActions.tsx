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

import Cls from './RowActions.module.scss';
import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/shared';
import { DataRow } from '../../core/data/data-source/DataSource';
import { prefixedTranslation } from '../../i18n/i18n';
import { IconDefs } from '../icon/IconDefs';
import { FaIcon } from '../icon/FaIcon';

const logger = Logger.get('RowActions.tsx');

interface Props {
  row: DataRow;
  onEdit?: (r: DataRow) => void;
  onDelete?: (r: DataRow) => void;
  onShowOnMap?: (r: DataRow) => void;
}

const t = prefixedTranslation('DataTable:');

class RowActions extends Component<Props, {}> {
  public render(): ReactNode {
    const { onShowOnMap } = this.props;
    return (
      <td className={Cls.actions}>
        <button onClick={this.handleEdit} title={t('Modify')} className={'btn btn-link'}>
          <FaIcon icon={IconDefs.faPencilAlt} />
        </button>
        {onShowOnMap && (
          <button onClick={this.handleShowOnMap} title={t('Show_on_map')} className={'btn btn-link'}>
            <FaIcon icon={IconDefs.faMapMarkerAlt} />
          </button>
        )}
        <button onClick={this.handleDelete} title={t('Delete')} className={'btn btn-link'}>
          <FaIcon icon={IconDefs.faTrashAlt} />
        </button>
      </td>
    );
  }

  private handleShowOnMap = () => {
    this.props.onShowOnMap && this.props.onShowOnMap(this.props.row);
  };

  private handleEdit = () => {
    this.props.onEdit && this.props.onEdit(this.props.row);
  };

  private handleDelete = () => {
    this.props.onDelete && this.props.onDelete(this.props.row);
  };
}

export default RowActions;
