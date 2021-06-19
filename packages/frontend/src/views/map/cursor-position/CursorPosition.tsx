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
import { Coordinate } from 'ol/coordinate';
import { toPrecision } from '../../../core/utils/numbers';

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

    const lon = toPrecision(position[0], 3);
    const lat = toPrecision(position[1], 3);
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
