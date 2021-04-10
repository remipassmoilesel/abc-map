import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-shared';
import { content as doc } from '@abc-map/documentation';
import { ServiceProps, withServices } from '../../core/withServices';
import Cls from './DocumentationView.module.scss';

const logger = Logger.get('Help.tsx', 'info');

class DocumentationView extends Component<ServiceProps, {}> {
  constructor(props: ServiceProps) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    return (
      <div className={Cls.documentation}>
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
}

export default withServices(DocumentationView);
