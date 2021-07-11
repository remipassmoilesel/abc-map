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
import { Logger } from '@abc-map/shared';
import { content as doc } from '@abc-map/user-documentation';
import { ServiceProps, withServices } from '../../core/withServices';
import Cls from './DocumentationView.module.scss';
import { MainState } from '../../core/store/reducer';
import { connect, ConnectedProps } from 'react-redux';
import { UiActions } from '../../core/store/ui/actions';
import * as _ from 'lodash';
import { pageSetup } from '../../core/utils/page-setup';

const logger = Logger.get('DocumentationView.tsx', 'info');

const mapStateToProps = (state: MainState) => ({
  position: state.ui.documentation.scrollPosition,
});

const mapDispatchToProps = {
  setPosition: UiActions.setDocumentationScrollPosition,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps;

class DocumentationView extends Component<Props, {}> {
  private viewPortRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    return (
      <div className={Cls.documentation}>
        <h1 className={Cls.header}>Documentation</h1>
        <div className={Cls.content}>
          <div className={Cls.toc} dangerouslySetInnerHTML={{ __html: doc.toc }} />
          <div className={Cls.viewport} ref={this.viewPortRef}>
            {doc.modules.map((mod, i) => (
              <div key={i} className={Cls.module} dangerouslySetInnerHTML={{ __html: mod }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  public componentDidMount() {
    pageSetup('Documentation', `La documentation contient des exemples pratiques, une FAQ et des explications sur le fonctionnement d'Abc-Map.`);

    const current = this.viewPortRef.current;
    if (!current) {
      logger.error('Ref not ready');
      return;
    }
    current.addEventListener('scroll', this.handleScroll);
    current.scrollTop = this.props.position;
  }

  public componentWillUnmount() {
    const current = this.viewPortRef.current;
    if (!current) {
      logger.error('Ref not ready');
      return;
    }
    current.removeEventListener('scroll', this.handleScroll);
  }

  private handleScroll = _.debounce(() => {
    const current = this.viewPortRef.current;
    if (!current) {
      logger.error('Ref not ready');
      return;
    }

    this.props.setPosition(current.scrollTop);
  }, 100);
}

export default connector(withServices(DocumentationView));
