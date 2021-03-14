import React, { Component, ReactNode } from 'react';
import { AbcProjectMetadata } from '@abc-map/shared-entities';
import { services } from '../../../core/Services';
import { ModalStatus } from '../../../core/ui/Modals.types';
import { Logger } from '@abc-map/frontend-shared';

const logger = Logger.get('ProjectStatus.tsx');

interface Props {
  project: AbcProjectMetadata;
}

class ProjectStatus extends Component<Props, {}> {
  private services = services();

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
    this.services.modals
      .renameModal('Renommer', 'Renommer le project', this.props.project.name)
      .then((event) => {
        if (event.status === ModalStatus.Confirmed) {
          this.services.project.renameProject(event.value);
        }
      })
      .catch((err) => {
        logger.error(err);
        this.services.toasts.genericError();
      });
  };
}

export default ProjectStatus;
