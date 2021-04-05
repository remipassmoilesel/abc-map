import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-shared';
import { ServiceProps, withServices } from '../../core/withServices';
import { DataRow, getFields } from '../../core/data/data-source/DataSource';
import Cls from './DataTable.module.scss';

const logger = Logger.get('DataSourceSelector.tsx');

interface Props extends ServiceProps {
  rows: DataRow[];
  className?: string;
}

class DataTable extends Component<Props, {}> {
  public render(): ReactNode {
    const className = this.props.className;
    const rows = this.props.rows;
    if (!rows.length) {
      return <div className={`${Cls.dataTable} ${className}`}>Pas de données</div>;
    }

    const keys = getFields(rows[0]);
    return (
      <div className={`${Cls.dataTable} ${className}`}>
        <table className={'table'}>
          <thead>
            <tr>
              <th scope="col" className={Cls.numberColumn}>
                #
              </th>
              {keys.map((key, i) => (
                <th scope="col" key={key + i}>
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
                  <td key={key + i} title={row[key]?.toString()}>
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
