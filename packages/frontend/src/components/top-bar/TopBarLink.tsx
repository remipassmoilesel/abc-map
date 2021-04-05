import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-shared';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Cls from './TopBarLink.module.scss';

const logger = Logger.get('TopBarSection.tsx', 'info');

export interface LocalProps {
  to: string;
  activeMatch?: RegExp;
  label: string;
  'data-cy'?: string;
}

export declare type Props = LocalProps & RouteComponentProps<any, any>;

class TopBarLink extends Component<Props, {}> {
  public render(): ReactNode {
    const activeMatch = this.props.activeMatch || this.props.to;
    const active = this.props.location.pathname.match(activeMatch);
    const classes = active ? `${Cls.topBarLink} ${Cls.active}` : Cls.topBarLink;
    const dataCy = this.props['data-cy'];

    return (
      <button onClick={this.handleClick} className={`btn btn-link ${classes}`} data-cy={dataCy}>
        {this.props.label}
      </button>
    );
  }

  private handleClick = () => {
    this.props.history.push(this.props.to);
  };
}

export default withRouter(TopBarLink);
