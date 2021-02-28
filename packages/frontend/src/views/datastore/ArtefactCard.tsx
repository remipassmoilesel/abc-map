import React, { Component, ReactNode } from 'react';
import { services } from '../../core/Services';
import { Logger } from '../../core/utils/Logger';
import { AbcArtefact } from '@abc-map/shared-entities';
import { FileFormat, FileFormats } from '../../core/data/FileFormats';
import { Zipper } from '../../core/data/Zipper';
import { FileIO } from '../../core/utils/FileIO';
import { HistoryKey } from '../../core/history/HistoryKey';
import { AddLayersTask } from '../../core/history/tasks/AddLayersTask';
import './DataStore.scss';

const logger = Logger.get('ArtefactCard.tsx', 'info');

interface Props {
  artefact: AbcArtefact;
}

class ArtefactCard extends Component<Props, {}> {
  private services = services();

  public render(): ReactNode {
    const artefact = this.props.artefact;
    return (
      <div className={'abc-artefact-card card card-body mb-2'}>
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
    this.services.ui.toasts.featureNotReady();
  };

  public handleImportArtefact = () => {
    this.services.ui.toasts.info('Import en cours ...');
    this.services.data
      .importArtefact(this.props.artefact)
      .then((res) => {
        if (!res.layers.length) {
          this.services.ui.toasts.error('Ces fichiers ne sont pas supportés');
          return;
        }

        const map = this.services.geo.getMainMap();
        this.services.history.register(HistoryKey.Map, new AddLayersTask(map, res.layers));

        this.services.ui.toasts.info('Import terminé !');
      })
      .catch((err) => {
        logger.error(err);
        this.services.ui.toasts.genericError();
      });
  };

  public handleDownloadArtefact = () => {
    this.services.ui.toasts.info('Téléchargement en cours ...');
    this.services.data
      .downloadFilesFrom(this.props.artefact)
      .then(async (res) => {
        let content: Blob;
        if (res.length === 1 && FileFormat.ZIP === FileFormats.fromPath(res[0].path)) {
          content = res[0].content;
        } else {
          content = await Zipper.zip(res);
        }

        FileIO.output(URL.createObjectURL(content), 'artefact.zip');
      })
      .catch((err) => {
        logger.error(err);
        this.services.ui.toasts.genericError();
      });
  };
}

export default ArtefactCard;
