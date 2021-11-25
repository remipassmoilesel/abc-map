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
import { getListByLang, getTextByLang, Logger } from '@abc-map/shared';
import { AbcArtefact } from '@abc-map/shared';
import { ServiceProps, withServices } from '../../../core/withServices';
import { Button, ButtonGroup, Dropdown, Modal } from 'react-bootstrap';
import { getLang, prefixedTranslation } from '../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './ArtefactCard.module.scss';

const logger = Logger.get('ArtefactCard.tsx');

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

const t = prefixedTranslation('DataStoreView:');

class ArtefactCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { licenseModal: false };
  }

  public render(): ReactNode {
    const link = this.props.artefact.link;
    const name = getTextByLang(this.props.artefact.name, getLang());
    const description = getTextByLang(this.props.artefact.description, getLang());
    const keywords = getListByLang(this.props.artefact.keywords, getLang());
    const licenseModal = this.state.licenseModal;
    const license = this.state.license;

    return (
      <>
        <div className={`card card-body ${Cls.artefact}`}>
          <h4 data-cy={'artefact-name'}>{name}</h4>

          {description && <div className={'mb-3'}>{description}</div>}

          <div className={'flex-grow-1'} />

          {keywords && (
            <small className={Cls.keywords}>
              {t('Keywords')}: {keywords.join(', ')}
            </small>
          )}

          {/* Actions */}

          <div className={'d-flex flex-row justify-content-end'}>
            <Dropdown as={ButtonGroup}>
              <Button variant={'outline-secondary'} onClick={this.handleImportArtefact} data-cy={'import-artefact'}>
                <i className={'fa fa-plus mr-2'} />
                {t('Add_to_project')}
              </Button>

              <Dropdown.Toggle split variant="outline-secondary" data-cy={'more-actions-menu'} />

              <Dropdown.Menu>
                <Dropdown.Item onClick={this.handleDownloadArtefact} data-cy={'download-artefact'}>
                  <i className={'fa fa-download mr-2'} />
                  {t('Download')}
                </Dropdown.Item>
                <Dropdown.Item href={link} rel="noreferrer" target={'_blank'}>
                  <i className={'fa fa-link mr-2'} /> {t('Source')}
                </Dropdown.Item>
                <Dropdown.Item onClick={this.handleShowLicense} data-cy={'show-license'}>
                  <i className={'fa fa-balance-scale mr-2'} />
                  {t('Licence')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* License modal */}

        <Modal show={licenseModal} onHide={this.handleModalClose} size={'lg'}>
          <Modal.Header closeButton data-cy={'license-header'}>
            {name} : {t('Licence')}
          </Modal.Header>
          <Modal.Body className={'d-flex justify-content-center'}>
            <pre className={Cls.licenseView}>{license}</pre>
          </Modal.Body>
          <Modal.Footer>
            <button className={'btn btn-outline-secondary'} onClick={this.handleModalClose} data-cy={'close-modal'}>
              {t('Close')}
            </button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  private handleShowLicense = () => {
    const { data } = this.props.services;
    const artefact = this.props.artefact;

    data
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

export default withTranslation()(withServices(ArtefactCard));
