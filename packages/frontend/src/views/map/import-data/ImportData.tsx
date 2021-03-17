import React, { Component, ReactNode } from 'react';
import { AbcFile, Logger } from '@abc-map/frontend-shared';
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
    const { toasts, data, geo, history } = this.props.services;

    FileIO.openInput(InputType.Multiple)
      .then((result) => {
        if (InputResultType.Canceled === result.type) {
          return;
        }

        toasts.info('Import en cours ...');
        const files: AbcFile[] = result.files.map((f) => ({ path: f.name, content: f }));

        return data.importFiles(files).then((res) => {
          if (!res.layers.length) {
            toasts.error("Ces formats de fichiers ne sont pas supportés, aucune donnée n'a été importée");
            return;
          }

          const map = geo.getMainMap();
          history.register(HistoryKey.Map, new AddLayersTask(map, res.layers));
          toasts.info('Import terminé !');
        });
      })
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      });
  };
}

export default withServices(ImportData);
