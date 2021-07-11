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
import { Modal } from 'react-bootstrap';
import { ModalEventType, ModalStatus } from '../../core/ui/typings';
import { ServiceProps, withServices } from '../../core/withServices';
import { Titles } from './titles';
import * as _ from 'lodash';
import { Encouragements } from './encouragements';
import { FrontendRoutes, Logger } from '@abc-map/shared';
import Cls from './SolicitationModal.module.scss';
import { VoteValue } from '@abc-map/shared';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const logger = Logger.get('SolicitationModal.ts');

declare type Props = ServiceProps & RouteComponentProps;

interface State {
  visible: boolean;
  title?: string;
  encouragement?: string;
}

class SolicitationModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { visible: false };
  }

  public render(): ReactNode {
    const visible = this.state.visible;
    const title = this.state.title;
    const encouragement = this.state.encouragement;
    if (!visible) {
      return <div />;
    }

    return (
      <Modal show={visible} onHide={this.close} size={'lg'}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={Cls.encouragement} dangerouslySetInnerHTML={{ __html: encouragement || '' }} />

          <div className={'d-flex flex-column justify-content-center align-items-center m-5'}>
            <p className={'text-center'}>
              Abc-Map est un logiciel libre hébergé et développé bénévolement,
              <br /> soutenez votre logiciel !
            </p>

            <button onClick={this.handleDonate} className={'btn btn-primary mt-5'}>
              Soutenir le développement
            </button>
            <button onClick={this.handleDonate} className={'btn btn-link'}>
              A quoi ça sert ?
            </button>
          </div>

          <div className={'mt-5 mx-4 text-center'}>
            <p>Comment ça c&apos;est passé ?</p>
          </div>

          <div className={'d-flex flex-row justify-content-center mb-4'}>
            <button onClick={() => this.handleVote(VoteValue.SATISFIED)} className={`btn btn-outline-primary ${Cls.voteBtn}`}>
              <span className={Cls.face}>🥰</span>
              Bien !
            </button>
            <button onClick={() => this.handleVote(VoteValue.BLAH)} className={`btn btn-outline-primary ${Cls.voteBtn}`}>
              <span className={Cls.face}>🥱</span>
              Bof ...
            </button>
            <button onClick={() => this.handleVote(VoteValue.NOT_SATISFIED)} className={`btn btn-outline-primary ${Cls.voteBtn}`}>
              <span className={Cls.face}>😞</span>
              Pas bien
            </button>
          </div>

          <div className={'d-flex justify-content-end'}>
            <button className={'btn btn-outline-secondary'} onClick={this.close} data-cy={'close-solicitation-modal'}>
              Fermer
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  public componentDidMount() {
    const { modals } = this.props.services;

    modals.addListener(ModalEventType.ShowSolicitation, this.handleOpen);
  }

  public componentWillUnmount() {
    const { modals } = this.props.services;

    modals.removeListener(ModalEventType.ShowSolicitation, this.handleOpen);
  }

  private handleOpen = () => {
    const title = _.sample(Titles);
    const encouragement = _.sample(Encouragements);
    this.setState({ visible: true, title, encouragement });
  };

  private handleVote = (value: VoteValue) => {
    const { vote } = this.props.services;
    // We do not wait for vote
    vote.vote(value).catch((err) => logger.error('Error while voting: ', err));
    this.close();
  };

  private handleDonate = () => {
    const { history } = this.props;
    history.push(FrontendRoutes.funding().raw());
    this.close();
  };

  private close = () => {
    const { modals } = this.props.services;

    modals.dispatch({
      type: ModalEventType.SolicitationClosed,
      status: ModalStatus.Confirmed,
    });

    this.setState({ visible: false });
  };
}

export default withRouter(withServices(SolicitationModal));
