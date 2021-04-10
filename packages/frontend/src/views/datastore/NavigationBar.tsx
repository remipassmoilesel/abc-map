import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-shared';
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
