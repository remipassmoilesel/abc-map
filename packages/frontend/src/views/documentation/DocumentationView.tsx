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
import { References } from '@abc-map/user-documentation';
import debounce from 'lodash/debounce';
import { ServiceProps, withServices } from '../../core/withServices';
import { MainState } from '../../core/store/reducer';
import { connect, ConnectedProps } from 'react-redux';
import { UiActions } from '../../core/store/ui/actions';
import { pageSetup } from '../../core/utils/page-setup';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { getDocumentationLang } from '../../i18n/i18n';
import Cls from './DocumentationView.module.scss';

const logger = Logger.get('DocumentationView.tsx');

const mapStateToProps = (state: MainState) => ({
  position: state.ui.documentation.scrollPosition,
});

const mapDispatchToProps = {
  setPosition: UiActions.setDocumentationScrollPosition,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & ServiceProps & RouteComponentProps;

class DocumentationView extends Component<Props, {}> {
  private viewPortRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const reference = References.find((ref) => ref.lang === getDocumentationLang());

    return (
      <div className={Cls.documentation}>
        {!reference && <h3 className={'my-5'}>Sorry, documentation is not available in your language</h3>}
        {reference && (
          <>
            <div className={Cls.toc} dangerouslySetInnerHTML={{ __html: reference?.toc }} />
            <div className={Cls.viewport} ref={this.viewPortRef}>
              {reference?.modules.map((mod, i) => (
                <div key={i} className={Cls.module} dangerouslySetInnerHTML={{ __html: mod }} />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  public componentDidMount() {
    pageSetup('Documentation', `La documentation explique le fonctionnement d'Abc-Map 📖`);

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

  private handleScroll = debounce(() => {
    const current = this.viewPortRef.current;
    if (!current) {
      logger.error('Ref not ready');
      return;
    }

    this.props.setPosition(current.scrollTop);
  }, 100);
}

export default connector(withRouter(withServices(DocumentationView)));
