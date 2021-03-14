import React, { Component, ReactNode } from 'react';
import { services } from '../../core/Services';
import { Logger } from '@abc-map/frontend-shared';
import { Documentation } from '@abc-map/documentation';
import Cls from './Help.module.scss';

const logger = Logger.get('Help.tsx', 'info');

interface State {
  documentation?: Documentation;
}

class Help extends Component<{}, State> {
  private services = services();

  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const doc = this.state.documentation;
    return (
      <div className={Cls.help}>
        <h1>Aide</h1>
        <p>Sur cette page, vous trouverez des tutoriels et le manuel d&apos;Abc-Map.</p>
        <p>L&apos;aide est en cours de rédaction.</p>
        {doc && (
          <>
            <div className={'toc'} dangerouslySetInnerHTML={{ __html: doc.toc }} />
            {doc.modules.map((mod, i) => (
              <div key={i} className={Cls.module} dangerouslySetInnerHTML={{ __html: mod }} />
            ))}
          </>
        )}
      </div>
    );
  }

  public componentDidMount() {
    import('@abc-map/documentation')
      .then((res) => {
        this.setState({ documentation: res.content });
      })
      .catch(() => this.services.toasts.genericError());
  }
}

export default Help;
