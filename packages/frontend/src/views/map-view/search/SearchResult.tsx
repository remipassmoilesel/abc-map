import React, { Component, ReactNode } from 'react';
import { NominatimResult } from '../../../core/geo/NominatimResult';
import { Logger } from '@abc-map/frontend-shared';
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
