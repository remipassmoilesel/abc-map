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
import { AbcProjectMetadata } from '@abc-map/shared';
import { ModalStatus } from '../../../core/ui/typings';
import { Logger } from '@abc-map/shared';
import { ServiceProps, withServices } from '../../../core/withServices';

const logger = Logger.get('ProjectStatus.tsx');

interface LocalProps {
  project: AbcProjectMetadata;
}

declare type Props = LocalProps & ServiceProps;

class ProjectStatus extends Component<Props, {}> {
  public render(): ReactNode {
    const metadata = this.props.project;
    return (
      <div className={'control-block d-flex flex-column'}>
        <div className={'control-item d-flex flex-column'}>
          <div data-cy="project-name">{metadata.name}</div>
          <div>Projection {metadata.projection.name}</div>
          <div>
            <button className={'btn btn-link'} onClick={this.onRename} data-cy="rename-project">
              Renommer
            </button>
          </div>
        </div>
      </div>
    );
  }

  private onRename = () => {
    const { modals, project, toasts } = this.props.services;

    modals
      .rename(`Renommer le projet '${this.props.project.name}'`, this.props.project.name)
      .then((event) => {
        if (event.status === ModalStatus.Confirmed) {
          project.renameProject(event.value);
        }
      })
      .catch((err) => {
        logger.error(err);
        toasts.genericError();
      });
  };
}

export default withServices(ProjectStatus);
