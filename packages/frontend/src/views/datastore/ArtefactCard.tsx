import React, { Component, ReactNode } from 'react';
import { services } from '../../core/Services';
import { Logger } from '../../core/utils/Logger';
import { AbcArtefact, AbcProperties, LayerProperties, LayerType } from '@abc-map/shared-entities';
import { FileFormat, FileFormats } from '../../core/datastore/FileFormats';
import { Zipper } from '../../core/datastore/Zipper';
import './DataStore.scss';
import * as uuid from 'uuid';

const logger = Logger.get('ArtefactCard.tsx', 'info');

interface Props {
  artefact: AbcArtefact;
}

class ArtefactCard extends Component<Props, {}> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const artefact = this.props.artefact;
    return (
      <div className={'abc-artefact-card card card-body mb-2'}>
        <h4>{artefact.name}</h4>
        <div>Description: {artefact.description}</div>
        <div onClick={this.showLicense}>Voir la license</div>
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
          <button className={'btn btn-link'} onClick={this.addArtefact}>
            Ajouter au projet
          </button>
          <button className={'btn btn-link'} onClick={this.downloadArtefact}>
            Télécharger
          </button>
        </div>
      </div>
    );
  }

  public showLicense = () => {
    this.services.toasts.featureNotReady();
  };

  public addArtefact = () => {
    this.services.toasts.info('Import en cours ...');
    const map = this.services.map.getMainMap();
    this.services.dataStore
      .getLayersFrom(this.props.artefact, this.services.map.getProjection(map))
      .then((layers) =>
        layers.forEach((l) => {
          l.set(AbcProperties.Managed, true);
          l.set(LayerProperties.Id, uuid.v4());
          l.set(LayerProperties.Name, 'Données du catalogue');
          l.set(LayerProperties.Type, LayerType.Vector);
          l.set(LayerProperties.Active, false);
          map.addLayer(l);
          this.services.toasts.info('Import terminé !');
        })
      )
      .catch((err) => {
        logger.error(err);
        this.services.toasts.genericError();
      });
  };

  public downloadArtefact = () => {
    this.services.dataStore
      .downloadFiles(this.props.artefact)
      .then(async (res) => {
        if (res.length === 1 && FileFormat.ZIP === FileFormats.fromPath(res[0].path)) {
          this.downloadZipFile(res[0].content);
        } else {
          const zip = await Zipper.zip(res);
          this.downloadZipFile(zip);
        }
      })
      .catch((err) => {
        logger.error(err);
        this.services.toasts.genericError();
      });
  };

  private downloadZipFile = (content: Blob) => {
    logger.info('Downloading zip file', content);
    const url = URL.createObjectURL(content);
    const anchorNode = document.createElement('a');
    anchorNode.style.display = 'none';
    anchorNode.setAttribute('href', url);
    anchorNode.setAttribute('download', 'artefact.zip');
    document.body.appendChild(anchorNode);
    anchorNode.click();
    anchorNode.remove();
  };
}

export default ArtefactCard;
