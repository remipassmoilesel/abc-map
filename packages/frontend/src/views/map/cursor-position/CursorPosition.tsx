import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-shared';
import { Coordinate } from 'ol/coordinate';

const logger = Logger.get('CursorPosition.tsx');

export interface Props {
  position?: Coordinate;
}

class CursorPosition extends Component<Props, {}> {
  public render(): ReactNode {
    const position = this.props.position;
    if (!position) {
      return <div />;
    }

    const lon = Math.round(position[0] * 1000) / 1000;
    const lat = Math.round(position[1] * 1000) / 1000;
    return (
      <div className={'control-block'}>
        <div className={'mb-2'}>Position du curseur</div>
        <div>Latitude: {lat}</div>
        <div>Longitude: {lon}</div>
      </div>
    );
  }
}

export default CursorPosition;
