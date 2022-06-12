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

import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Modal } from 'react-bootstrap';
import { AbcProjection, DEFAULT_PROJECTION, Language, Logger } from '@abc-map/shared';
import { MainState } from '../../../../core/store/reducer';
import { connect, ConnectedProps } from 'react-redux';
import { ServiceProps, withServices } from '../../../../core/withServices';
import View from 'ol/View';
import { Views } from '../../../../core/geo/Views';
import { MapWrapper } from '../../../../core/geo/map/MapWrapper';
import { getLang, prefixedTranslation } from '../../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { IconDefs } from '../../../../components/icon/IconDefs';
import { FaIcon } from '../../../../components/icon/FaIcon';
import Cls from './EditProjectModal.module.scss';

const logger = Logger.get('EditProjectModal.tsx');

interface LocalProps {
  visible: boolean;
  onClose: () => void;
}

const mapStateToProps = (state: MainState) => ({
  name: state.project.metadata.name,
  projection: state.project.mainView.projection,
  layouts: state.project.layouts.list,
  sharedViews: state.project.sharedViews.list,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps & LocalProps;

interface State {
  nameInput: string;
  projectionInput: string;
  message: string;
}

const t = prefixedTranslation('MapView:EditProjectModal.');

class EditProjectModal extends Component<Props, State> {
  private mainMap: MapWrapper;

  constructor(props: Props) {
    super(props);
    this.state = { nameInput: '', projectionInput: '', message: '' };
    this.mainMap = props.services.geo.getMainMap();
  }

  public render(): ReactNode {
    const { visible, onClose } = this.props;
    const { nameInput, projectionInput, message } = this.state;
    if (!visible) {
      return <div />;
    }

    // As we do not migrate vector features and layouts for the moment, we do not allow projection changes
    // if vector layers or layouts are present.
    const hasVectorLayers = !!this.mainMap.getLayers().find((l) => l.isVector());
    const hasLayouts = !!this.props.layouts.length;
    const hasSharedViews = !!this.props.sharedViews.length;
    const projectionDisabled = hasVectorLayers || hasLayouts || hasSharedViews;

    let link: string;
    switch (getLang()) {
      case Language.French:
        link = 'https://fr.wikipedia.org/wiki/Syst%C3%A8me_de_coordonn%C3%A9es_(cartographie)';
        break;
      default:
        link = 'https://en.wikipedia.org/wiki/Spatial_reference_system';
    }

    return (
      <Modal show={true} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('Edit_project')} ✏️</Modal.Title>
        </Modal.Header>
        <Modal.Body className={'d-flex flex-column p-3'}>
          {/* Project name */}
          <div className={'d-flex flex-column mb-4'}>
            <div className={'mb-2'}>{t('Name_of_project')}</div>
            <input
              type={'text'}
              value={nameInput}
              onChange={this.handleNameChange}
              className={'form-control'}
              data-cy={'project-name-input'}
              data-testid={'project-name-input'}
            />
          </div>

          {/* Project input */}
          <div className={'d-flex flex-column mb-4'}>
            <div className={'d-flex align-items-center mb-2'}>
              {t('Projection')}
              <a href={link} className={'mx-2'} target={'_blank'} rel="noreferrer">
                <FaIcon icon={IconDefs.faQuestionCircle} />
              </a>
            </div>

            <input
              type={'text'}
              value={projectionInput}
              onChange={this.handleProjectionChange}
              disabled={projectionDisabled}
              className={'form-control'}
              data-cy={'projection-input'}
              data-testid={'projection-input'}
            />

            {!projectionDisabled && (
              <div className={'d-flex flex-row justify-content-end align-items-center mt-2'}>
                <button onClick={this.handleDefaultProjection} disabled={projectionDisabled} className={'btn btn-link'}>
                  {t('Default_value')}
                </button>
              </div>
            )}
            {projectionDisabled && <div className={`mx-2 mt-2 ${Cls.advice}`}>{t('To_change_projection_you_must_delete_geometries')}</div>}

            {message && <div>{message}</div>}
          </div>

          {/* Button bar */}
          <div className={'d-flex justify-content-end'}>
            <button className={'btn btn-outline-secondary mr-2'} onClick={onClose} data-cy="button-cancel">
              {t('Cancel')}
            </button>
            <button className={'btn btn-primary'} onClick={this.handleConfirm} data-cy="button-confirm" data-testid={'button-confirm'}>
              {t('Confirm')}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  public componentDidMount() {
    this.initializeState(this.props);
  }

  public componentDidUpdate(prevProps: Readonly<Props>) {
    const shown = this.props.visible && prevProps.visible !== this.props.visible;
    if (shown) {
      this.initializeState(this.props);
    }
  }

  private initializeState(props: Props) {
    this.setState({ nameInput: props.name, projectionInput: props.projection.name, message: '' });
  }

  private handleNameChange = (ev: ChangeEvent<HTMLInputElement>) => {
    this.setState({ nameInput: ev.target.value });
  };

  private handleProjectionChange = (ev: ChangeEvent<HTMLInputElement>) => {
    this.setState({ projectionInput: ev.target.value });
  };

  private handleDefaultProjection = () => {
    this.setState({ projectionInput: DEFAULT_PROJECTION.name });
  };

  private handleConfirm = () => {
    const { project } = this.props.services;
    const { onClose: closeModal, name, projection } = this.props;
    const newName = this.state.nameInput;
    const newProj: AbcProjection = { name: this.state.projectionInput };

    // Update project name if needed
    if (newName !== name) {
      project.renameProject(this.state.nameInput);
    }

    // Update projection if needed
    if (newProj.name !== projection.name) {
      this.updateProjection(newProj)
        .then(closeModal)
        .catch((err) => {
          this.setState({ message: t('You_can_not_use_this_projection') });
          logger.error('Cannot load projection: ', err);
        });
    }

    // Nothing to update
    else {
      closeModal();
    }
  };

  private updateProjection = async (projection: AbcProjection): Promise<void> => {
    const { geo, project } = this.props.services;

    // We update project and view, and we reset rotation
    const extent = await geo.loadProjection(projection.name);
    const newView = new View({ projection: projection.name, rotation: 0 });
    newView.fit(extent);

    geo.getMainMap().unwrap().setView(newView);
    project.setView(Views.olToAbc(newView));
  };
}

export default withTranslation()(withServices(connector(EditProjectModal)));
