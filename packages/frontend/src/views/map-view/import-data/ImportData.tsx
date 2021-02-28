import React, { Component, ReactNode } from 'react';
import { services } from '../../../core/Services';
import { Logger } from '../../../core/utils/Logger';
import { FileInputType, FileIO } from '../../../core/utils/FileIO';
import { AbcFile } from '../../../core/data/readers/AbcFile';
import { AddLayersTask } from '../../../core/history/tasks/AddLayersTask';
import { HistoryKey } from '../../../core/history/HistoryKey';
import './ImportData.module.scss';

const logger = Logger.get('ImportData.tsx', 'debug');

class ImportData extends Component<{}, {}> {
  private services = services();

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
    FileIO.openInput(true)
      .then((result) => {
        if (FileInputType.Canceled === result.type) {
          return;
        }

        this.services.ui.toasts.info('Import en cours ...');
        const files: AbcFile[] = result.files.map((f) => ({ path: f.name, content: f }));

        return this.services.data.importFiles(files).then((res) => {
          if (!res.layers.length) {
            this.services.ui.toasts.error('Ces fichiers ne sont pas supportés');
            return;
          }

          const map = this.services.geo.getMainMap();
          this.services.history.register(HistoryKey.Map, new AddLayersTask(map, res.layers));

          this.services.ui.toasts.info('Import terminé !');
        });
      })
      .catch((err) => {
        logger.error(err);
        this.services.ui.toasts.genericError();
      });
  };
}

export default ImportData;
