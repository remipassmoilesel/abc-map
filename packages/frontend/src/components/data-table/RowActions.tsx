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
import { DataRow } from '../../core/data/data-source/DataSource';
import { prefixedTranslation } from '../../i18n/i18n';

const logger = Logger.get('RowActions.tsx');

interface Props {
  row: DataRow;
  onEdit: (r: DataRow) => void;
  onDelete: (r: DataRow) => void;
}

const t = prefixedTranslation('DataTable:');

class RowActions extends Component<Props, {}> {
  public render(): ReactNode {
    return (
      <>
        <button onClick={this.handleEdit} title={t('Modify')} className={'btn btn-link'}>
          <i className={'fa fa-pencil-alt'} />
        </button>
        <button onClick={this.handleDelete} title={t('Delete')} className={'btn btn-link'}>
          <i className={'fa fa-trash-alt'} />
        </button>
      </>
    );
  }

  private handleEdit = () => {
    this.props.onEdit(this.props.row);
  };

  private handleDelete = () => {
    this.props.onDelete(this.props.row);
  };
}

export default RowActions;
