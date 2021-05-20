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
import { NominatimResult } from '../../../core/geo/NominatimResult';
import { Logger } from '@abc-map/shared';
import Cls from './SearchResult.module.scss';

const logger = Logger.get('SearchResult.tsx');

export interface Props {
  result: NominatimResult;
  onClick: (res: NominatimResult) => void;
}

class SearchResult extends Component<Props, {}> {
  public render(): ReactNode {
    const res = this.props.result;
    return (
      <div title={res.display_name} onClick={this.handleClick} className={Cls.result} data-cy={'search-result'}>
        {res.display_name.substr(0, 50)}
      </div>
    );
  }

  public handleClick = () => {
    this.props.onClick(this.props.result);
  };
}

export default SearchResult;
