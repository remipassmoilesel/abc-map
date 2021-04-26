import React, { Component } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import Cls from './FoldableCard.module.scss';

const logger = Logger.get('FoldableCard.tsx', 'info');

interface Props {
  className?: string;
  title: string;
}

interface State {
  isOpen: boolean;
}

class FoldableCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isOpen: true };
  }

  public render() {
    const isOpen = this.state.isOpen;
    const icon = `fa fa-chevron-${isOpen ? 'down' : 'right'}`;
    const toolTip = `${isOpen ? 'Fermer' : 'Ouvrir'} la section`;
    const className = this.props.className;
    const title = this.props.title;

    return (
      <div className={`${Cls.foldableCard} card ${className}`}>
        <div className={Cls.title} onClick={this.toggleCard} title={toolTip}>
          <div>{title}</div>
          <button className="btn btn-link">
            <i className={icon} />
          </button>
        </div>
        {isOpen && <div className={'card-body'}>{this.props.children}</div>}
      </div>
    );
  }

  private toggleCard = () => {
    this.setState((state) => ({ isOpen: !state.isOpen }));
  };
}

export default FoldableCard;
