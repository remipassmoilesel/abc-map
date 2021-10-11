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
import { AbcFile, Logger } from '@abc-map/shared';
import { FileIO, InputResultType, InputType } from '../../../core/utils/FileIO';
import { ServiceProps, withServices } from '../../../core/withServices';
import { ImportStatus } from '../../../core/data/DataService';
import { OperationStatus } from '../../../core/ui/typings';
import { withTranslation } from 'react-i18next';
import { prefixedTranslation } from '../../../i18n/i18n';
import Cls from './ImportData.module.scss';

const logger = Logger.get('ImportData.tsx');

const t = prefixedTranslation('MapView:ImportData.');

class ImportData extends Component<ServiceProps, {}> {
  public render(): ReactNode {
    return (
      <div className={'control-block'}>
        <div className={'control-item'}>
          <button onClick={this.importFile} type={'button'} className={'btn btn-link'} data-cy={'import-data'}>
            <i className={'fa fa-table mr-2'} /> {t('Import_data')}
          </button>
        </div>
        <div className={`mb-2 ${Cls.advice}`}>{t('You_can_also_drop_on_map')}</div>
      </div>
    );
  }

  private importFile = () => {
    const { toasts, data, modals } = this.props.services;

    const selectFiles = async (): Promise<AbcFile<Blob>[] | undefined> => {
      const result = await FileIO.openInput(InputType.Multiple);
      if (InputResultType.Canceled === result.type) {
        return;
      }

      return result.files.map((f) => ({ path: f.name, content: f }));
    };

    const importFiles = async (files: AbcFile<Blob>[]) => {
      const result = await data.importFiles(files);

      if (result.status === ImportStatus.Failed) {
        toasts.error(t('Formats_not_supported'));
        return;
      }

      if (result.status === ImportStatus.Canceled) {
        return OperationStatus.Interrupted;
      }
    };

    selectFiles()
      .then((files) => {
        if (files) {
          return modals.longOperationModal(() => importFiles(files));
        }
      })
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      });
  };
}

export default withTranslation()(withServices(ImportData));
