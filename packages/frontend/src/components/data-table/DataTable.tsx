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

import React, { useEffect, useState } from 'react';
import { Logger } from '@abc-map/shared';
import { DataRow, DataValue } from '../../core/data/data-source/DataSource';
import RowActions from './RowActions';
import { prefixedTranslation } from '../../i18n/i18n';
import Cls from './DataTable.module.scss';
import clsx from 'clsx';
import { getAllFieldNames } from '../../core/data/getFieldNames';

const logger = Logger.get('DataSourceSelector.tsx');

interface Props {
  rows: DataRow[];
  onEdit?: (r: DataRow) => void;
  onDelete?: (r: DataRow) => void;
  onShowOnmap?: (r: DataRow) => void;
  withActions?: boolean;
  className?: string;
  'data-cy'?: string;
}

const t = prefixedTranslation('DataTable:');

function DataTable(props: Props) {
  const { className, rows, 'data-cy': dataCy, onEdit, onDelete, onShowOnmap } = props;
  const withActions = props.withActions ?? false;
  const [fields, setFields] = useState<string[]>([]);

  // Each time rows change, we get keys from objet. We must iterate on each row.
  useEffect(() => {
    const fields = getAllFieldNames(rows);
    setFields(fields);
  }, [rows]);

  if (!rows.length) {
    return <div className={clsx(Cls.dataTable, className)}>{t('No_data')}</div>;
  }

  return (
    <div className={clsx(Cls.dataTable, className)} data-cy={dataCy}>
      <table className={'table table-sm table-bordered table-hover'}>
        <thead>
          <tr>
            <th scope="col" className={Cls.numberColumn}>
              #
            </th>

            {fields.map((key, i) => (
              <th scope="col" key={key + i} data-cy={'header'}>
                {key}
              </th>
            ))}

            {!fields.length && <th scope="col">&nbsp;</th>}

            {withActions && <th>{t('Actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id} data-testid={'data-row'}>
              {/* Row number */}
              <th scope="row" className={Cls.numberColumn}>
                {i + 1}
              </th>

              {/* Data */}
              {fields.map((key) => (
                <td key={key + i} title={row.data[key]?.toString()} data-cy={'cell'}>
                  {normalize(row.data[key])}
                </td>
              ))}

              {!fields.length && <td>{t('This_feature_is_empty')}</td>}

              {/* Actions */}
              {withActions && <RowActions row={row} onEdit={onEdit} onDelete={onDelete} onShowOnMap={onShowOnmap} />}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function normalize(field: DataValue | undefined): string | undefined {
  if (typeof field === 'string' && field.length > 50) {
    return `${field.substring(0, 47)}...`;
  } else if (typeof field === 'undefined') {
    return t('Undefined');
  } else {
    return field + '';
  }
}

export default DataTable;
