import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-shared';
import { Documentation } from '@abc-map/documentation';
import { ServiceProps, withServices } from '../../core/withServices';
import Cls from './HelpView.module.scss';

const logger = Logger.get('Help.tsx', 'info');

interface State {
  documentation?: Documentation;
}

class HelpView extends Component<ServiceProps, State> {
  constructor(props: ServiceProps) {
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
    const { toasts } = this.props.services;

    import('@abc-map/documentation')
      .then((res) => {
        this.setState({ documentation: res.content });
      })
      .catch(() => toasts.genericError());
  }
}

export default withServices(HelpView);
