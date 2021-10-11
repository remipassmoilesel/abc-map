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
import EditProjectModal from './edit-project-modal/EditProjectModal';
import { MainState } from '../../../core/store/reducer';
import { connect, ConnectedProps } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { prefixedTranslation } from '../../../i18n/i18n';
import Cls from './ProjectStatus.module.scss';

const logger = Logger.get('ProjectStatus.tsx');

const mapStateToProps = (state: MainState) => ({
  metadata: state.project.metadata,
  view: state.project.view,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector>;

interface State {
  editModal: boolean;
}

const t = prefixedTranslation('MapView:ProjectStatus.');

class ProjectStatus extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { editModal: false };
  }

  public render(): ReactNode {
    const { view, metadata } = this.props;
    const editModal = this.state.editModal;

    return (
      <div className={'control-block d-flex flex-column'}>
        {/* Project name */}
        <div className={Cls.name} data-cy="project-name">
          {metadata.name}
        </div>

        {/* Current projection */}
        <div className={Cls.projection}>
          {t('Projection')}: {view.projection.name}
        </div>

        {/* Edit button and modal */}
        <div className={`control-item mt-3`}>
          <button onClick={this.handleEditClick} className={'btn btn-link'} data-cy="edit-project">
            <i className={'fa fa-pencil-alt mr-2'} /> {t('Edit')}
          </button>
        </div>

        <EditProjectModal visible={editModal} onClose={this.handleModalClose} />
      </div>
    );
  }

  private handleEditClick = () => {
    this.setState({ editModal: true });
  };

  private handleModalClose = () => {
    this.setState({ editModal: false });
  };
}

export default withTranslation()(withTranslation()(connector(ProjectStatus)));
