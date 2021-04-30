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
import { AbcArtefact } from '@abc-map/shared-entities';
import { ServiceProps, withServices } from '../../../core/withServices';
import { Modal } from 'react-bootstrap';
import Cls from './ArtefactCard.module.scss';

const logger = Logger.get('ArtefactCard.tsx', 'info');

interface LocalProps {
  artefact: AbcArtefact;
  onImport: (artefact: AbcArtefact) => void;
  onDownload: (artefact: AbcArtefact) => void;
}

declare type Props = LocalProps & ServiceProps;

interface State {
  licenseModal: boolean;
  license?: string;
}

class ArtefactCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      licenseModal: false,
    };
  }

  public render(): ReactNode {
    const name = this.props.artefact.name;
    const link = this.props.artefact.link;
    const description = this.props.artefact.description;
    const keywords = this.props.artefact.keywords;
    const licenseModal = this.state.licenseModal;
    const license = this.state.license;

    return (
      <>
        <div className={`card card-body ${Cls.artefact}`}>
          {/* Meta */}

          <h5 data-cy={'artefact-name'}>{name}</h5>
          {keywords && <small className={'mb-2'}>Mots clés: {keywords.join(', ')}</small>}
          {description && <div className={'mb-3'}>{description}</div>}
          {!!link && (
            <div>
              Lien:&nbsp;
              <a href={link} rel="noreferrer" target={'_blank'}>
                {link}
              </a>
            </div>
          )}

          <div className={'flex-grow-1'} />

          {/* Actions */}

          <div className={'d-flex flex-row justify-content-end'}>
            <button className={'btn btn-link mr-2'} onClick={this.handleShowLicense} data-cy={'show-license'}>
              License d&apos;utilisation
            </button>
            <button className={'btn btn-link mr-2'} onClick={this.handleDownloadArtefact} data-cy={'download-artefact'}>
              Télécharger
            </button>
            <button className={'btn btn-outline-primary'} onClick={this.handleImportArtefact} data-cy={'import-artefact'}>
              Ajouter au projet
            </button>
          </div>
        </div>

        {/* License modal */}

        <Modal show={licenseModal} onHide={this.handleModalClose} size={'lg'}>
          <Modal.Header closeButton data-cy={'license-header'}>
            {name} : License d&apos;utilisation
          </Modal.Header>
          <Modal.Body className={'d-flex justify-content-center'}>
            <pre className={Cls.licenseView}>{license}</pre>
          </Modal.Body>
          <Modal.Footer>
            <button className={'btn btn-outline-secondary'} onClick={this.handleModalClose} data-cy={'close-modal'}>
              Fermer
            </button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  private handleShowLicense = () => {
    const { dataStore } = this.props.services;
    const artefact = this.props.artefact;

    dataStore
      .downloadLicense(artefact)
      .then((license) => this.setState({ licenseModal: true, license }))
      .catch((err) => logger.error(err));
  };

  private handleImportArtefact = () => {
    this.props.onImport(this.props.artefact);
  };

  private handleDownloadArtefact = () => {
    this.props.onDownload(this.props.artefact);
  };

  private handleModalClose = () => {
    this.setState({ licenseModal: false });
  };
}

export default withServices(ArtefactCard);
