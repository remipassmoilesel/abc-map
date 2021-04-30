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
import { Logger } from '@abc-map/frontend-commons';
import { ServiceProps, withServices } from '../../core/withServices';
import { DataRow, getFields } from '../../core/data/data-source/DataSource';
import Cls from './DataTable.module.scss';

const logger = Logger.get('DataSourceSelector.tsx');

interface Props extends ServiceProps {
  rows: DataRow[];
  className?: string;
  'data-cy'?: string;
}

class DataTable extends Component<Props, {}> {
  public render(): ReactNode {
    const className = this.props.className;
    const rows = this.props.rows;
    if (!rows.length) {
      return <div className={`${Cls.dataTable} ${className}`}>Pas de données</div>;
    }

    const dataCy = this.props['data-cy'];
    const keys = getFields(rows[0]);
    return (
      <div className={`${Cls.dataTable} ${className}`} data-cy={dataCy}>
        <table className={'table'}>
          <thead>
            <tr>
              <th scope="col" className={Cls.numberColumn}>
                #
              </th>
              {keys.map((key, i) => (
                <th scope="col" key={key + i} data-cy={'header'}>
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row._id}>
                <th scope="row" className={Cls.numberColumn}>
                  {i + 1}
                </th>
                {keys.map((key) => (
                  <td key={key + i} title={row[key]?.toString()} data-cy={'cell'}>
                    {this.normalize(row[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  private normalize(field: string | number | undefined): string | number | undefined {
    if (typeof field === 'number') {
      return field;
    } else if (typeof field === 'string' && field.length > 50) {
      return `${field.substr(0, 47)}...`;
    } else if (typeof field === 'undefined') {
      return 'Sans valeur';
    } else {
      return field;
    }
  }
}

export default withServices(DataTable);
