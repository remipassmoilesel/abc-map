import React, { Component, ReactNode } from 'react';
import { AbcProject } from '@abc-map/shared-entities';

interface Props {
  project?: AbcProject;
}

class ProjectStatus extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const projectName = this.props.project?.metadata.name;
    let message: string | undefined;
    if (!projectName) {
      message = 'Pas de projet actif';
    }
    return (
      <div className={'control-block d-flex flex-column'}>
        <div className={'control-item'}>
          Projet courant:
          <div>{projectName}</div>
          <div>{message}</div>
        </div>
      </div>
    );
  }
}

export default ProjectStatus;
