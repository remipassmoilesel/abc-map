import React, { Component, ReactNode } from 'react';
import { services } from '../../core/Services';
import { Logger } from '../../core/utils/Logger';
import './Help.scss';

const logger = Logger.get('Help.tsx', 'info');

class Help extends Component<{}, {}> {
  private services = services();

  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    return (
      <div className={'abc-help'}>
        <h1>Aide</h1>
        <p>Sur cette page, vous trouverez des tutoriels et le manuel d&apos;Abc-Map.</p>
        <p>Cette page n&apos;est pas terminée !</p>
      </div>
    );
  }
}

export default Help;
