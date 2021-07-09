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
import { AbcFile } from '@abc-map/shared';
import { FileIO, InputResultType, InputType } from '../../../core/utils/FileIO';
import { AddLayersTask } from '../../../core/history/tasks/layers/AddLayersTask';
import { HistoryKey } from '../../../core/history/HistoryKey';
import { ServiceProps, withServices } from '../../../core/withServices';
import './ImportData.module.scss';

const logger = Logger.get('ImportData.tsx', 'debug');

class ImportData extends Component<ServiceProps, {}> {
  public render(): ReactNode {
    return (
      <div className={'control-block'}>
        <div className={'control-item'}>
          <button onClick={this.importFile} type={'button'} className={'btn btn-link'} data-cy={'import-data'}>
            <i className={'fa fa-table mr-2'} /> Importer des données
          </button>
        </div>
        <div>
          <i>Vous pouvez importer des données en sélectionnant un fichier et en le déposant sur la carte</i>
        </div>
      </div>
    );
  }

  private importFile = () => {
    const { toasts, dataStore, geo, history, modals } = this.props.services;

    const selectFiles = async (): Promise<AbcFile<Blob>[] | undefined> => {
      const result = await FileIO.openInput(InputType.Multiple);
      if (InputResultType.Canceled === result.type) {
        return;
      }

      return result.files.map((f) => ({ path: f.name, content: f }));
    };

    const importFiles = async (files: AbcFile<Blob>[]) => {
      const result = await dataStore.importFiles(files);

      if (!result.layers.length) {
        toasts.error("Ces formats de fichiers ne sont pas supportés, aucune donnée n'a été importée");
        return;
      }

      const map = geo.getMainMap();
      history.register(HistoryKey.Map, new AddLayersTask(map, result.layers));
      toasts.info('Import terminé !');
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

export default withServices(ImportData);
