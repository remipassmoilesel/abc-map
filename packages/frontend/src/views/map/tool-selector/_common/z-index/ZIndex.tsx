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
import { ServiceProps, withServices } from '../../../../../core/withServices';
import Cls from './ZIndex.module.scss';

class ZIndex extends Component<ServiceProps, {}> {
  public render(): ReactNode {
    return (
      <div className={`control-item ${Cls.zIndex}`}>
        <div>Z index:</div>
        <button onClick={this.handleBack} className={'btn btn-link'}>
          <i className={'fa fa-arrow-up'} /> Derrière
        </button>
        <button onClick={this.handleForward} className={'btn btn-link'}>
          <i className={'fa fa-arrow-down'} /> Devant
        </button>
      </div>
    );
  }

  private handleBack = () => {
    const { geo } = this.props.services;
    geo.updateSelectedFeatures((s) => {
      return {
        ...s,
        zIndex: (s.zIndex || 0) - 1,
      };
    });
  };

  private handleForward = () => {
    const { geo } = this.props.services;
    geo.updateSelectedFeatures((s) => {
      return {
        ...s,
        zIndex: (s.zIndex || 0) + 1,
      };
    });
  };
}

export default withServices(ZIndex);
