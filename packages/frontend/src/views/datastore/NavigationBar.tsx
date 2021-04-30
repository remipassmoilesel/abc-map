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
import { Logger } from '@abc-map/frontend-commons';
import * as _ from 'lodash';

const logger = Logger.get('NavigationBar.tsx', 'info');

interface Props {
  activePage: number;
  offset: number;
  total: number;
  pageSize: number;
  onClick: (page: number, limit: number, offset: number) => void;
}

// TODO: unit test

class NavigationBar extends Component<Props> {
  public render(): ReactNode {
    const activePage = this.props.activePage;
    const total = this.props.total;
    const pageSize = this.props.pageSize;
    const numberOfPages = this.numberOfPages(total, pageSize);

    return (
      <div>
        <button onClick={() => this.handleClick(activePage - 1)} className={'btn btn-link mr-2'}>
          &lt;
        </button>
        {_.range(1, numberOfPages + 1).map((pageNbr) => {
          const isActive = pageNbr === activePage;
          const classes = `btn btn-link mr-2 ${isActive ? 'font-weight-bold' : ''}`;
          return (
            <button key={pageNbr} onClick={() => this.handleClick(pageNbr)} className={classes}>
              {pageNbr}
            </button>
          );
        })}
        <button onClick={() => this.handleClick(activePage + 1)} className={'btn btn-link mr-2'}>
          &gt;
        </button>
      </div>
    );
  }

  private handleClick = (pageNbr: number) => {
    const { pageSize, total } = this.props;
    const numberOfPages = this.numberOfPages(total, pageSize);

    if (pageNbr < 1) {
      pageNbr = 1;
    }

    if (pageNbr > numberOfPages) {
      pageNbr = numberOfPages;
    }

    const limit = pageSize;
    const offset = (pageNbr - 1) * pageSize;

    this.props.onClick(pageNbr, limit, offset);
  };

  private numberOfPages(total: number, pageSize: number): number {
    return Math.ceil(total / pageSize);
  }
}

export default NavigationBar;
