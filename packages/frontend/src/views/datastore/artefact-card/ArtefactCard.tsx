import React, { Component, ReactNode } from 'react';
import { Logger, Zipper } from '@abc-map/frontend-shared';
import { AbcArtefact } from '@abc-map/shared-entities';
import { FileFormat, FileFormats } from '../../../core/data/FileFormats';
import { FileIO } from '../../../core/utils/FileIO';
import { HistoryKey } from '../../../core/history/HistoryKey';
import { AddLayersTask } from '../../../core/history/tasks/layers/AddLayersTask';
import { ServiceProps, withServices } from '../../../core/withServices';

const logger = Logger.get('ArtefactCard.tsx', 'info');

interface LocalProps {
  artefact: AbcArtefact;
}

declare type Props = LocalProps & ServiceProps;

class ArtefactCard extends Component<Props, {}> {
  public render(): ReactNode {
    const artefact = this.props.artefact;
    return (
      <div className={'card card-body mb-2'}>
        <h4>{artefact.name}</h4>
        <div>Description: {artefact.description}</div>
        <div onClick={this.handleShowLicense}>Voir la license</div>
        <div>Mots clés: {artefact.keywords.length ? artefact.keywords.join(', ') : 'Pas de mots clés'}</div>
        <div>
          Liens:
          <ul>
            {artefact.links.map((link, i) => {
              return (
                <li key={i}>
                  <a href={link} rel="noreferrer" target={'_blank'}>
                    {link}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={'d-flex flex-row'}>
          <button className={'btn btn-link'} onClick={this.handleImportArtefact}>
            Ajouter au projet
          </button>
          <button className={'btn btn-link'} onClick={this.handleDownloadArtefact}>
            Télécharger
          </button>
        </div>
      </div>
    );
  }

  public handleShowLicense = () => {
    this.props.services.toasts.featureNotReady();
  };

  public handleImportArtefact = () => {
    const { toasts, data, geo, history } = this.props.services;

    toasts.info('Import en cours ...');
    data
      .importArtefact(this.props.artefact)
      .then((res) => {
        if (!res.layers.length) {
          toasts.error('Ces fichiers ne sont pas supportés');
          return;
        }

        const map = geo.getMainMap();
        history.register(HistoryKey.Map, new AddLayersTask(map, res.layers));

        toasts.info('Import terminé !');
      })
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      });
  };

  public handleDownloadArtefact = () => {
    const { toasts, data } = this.props.services;

    toasts.info('Téléchargement en cours ...');
    data
      .downloadFilesFrom(this.props.artefact)
      .then(async (res) => {
        let content: Blob;
        if (res.length === 1 && FileFormat.ZIP === FileFormats.fromPath(res[0].path)) {
          content = res[0].content;
        } else {
          content = await Zipper.zipFiles(res);
        }

        FileIO.output(URL.createObjectURL(content), 'artefact.zip');
      })
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      });
  };
}

export default withServices(ArtefactCard);
