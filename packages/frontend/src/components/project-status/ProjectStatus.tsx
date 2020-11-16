import React, { Component, ReactNode } from 'react';
import { Project } from '@abc-map/shared-entities';

interface Props {
  project?: Project;
}

class ProjectStatus extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const projectName = this.props.project?.name;
    let message: string | undefined;
    if (!projectName) {
      message = 'Pas de projet actif';
    }
    return (
      <div className={'d-flex flex-column'}>
        <small>Project courant</small>
        <div>{projectName}</div>
        <div>{message}</div>
      </div>
    );
  }
}

export default ProjectStatus;
