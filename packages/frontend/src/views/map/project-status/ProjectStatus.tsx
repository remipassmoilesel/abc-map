import React, { Component, ReactNode } from 'react';
import { AbcProjectMetadata } from '@abc-map/shared-entities';
import { ModalStatus } from '../../../core/ui/Modals.types';
import { Logger } from '@abc-map/frontend-shared';
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
          <div>Projection: {metadata.projection.name}</div>
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
      .renameModal('Renommer', 'Renommer le project', this.props.project.name)
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
