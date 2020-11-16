import React, { Component, ReactNode } from 'react';
import { Project } from '@abc-map/shared-entities';

interface Props {
  project?: Project;
}

class LayerSelector extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const layers = this.props.project?.layers.map((layer) => <div key={layer.id}>{layer.name}</div>);
    let message: string | undefined;
    if (!layers || !layers.length) {
      message = 'Projet vide';
    }
    return (
      <div className={'d-flex flex-column'}>
        <div>Couches</div>
        {layers}
        <div>{message}</div>
      </div>
    );
  }
}

export default LayerSelector;
