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
import { ModalEventListener, ModalEventType, ModalStatus } from '../../core/ui/typings';
import { ServiceProps, withServices } from '../../core/withServices';
import { Titles } from './titles';
import * as _ from 'lodash';
import { Encouragements } from './encouragements';
import { Logger } from '@abc-map/frontend-commons';
import Cls from './SolicitationModal.module.scss';
import { VoteValue } from '@abc-map/shared-entities';

interface State {
  visible: boolean;
  listener?: ModalEventListener;
  title?: string;
  encouragement?: string;
}

const logger = Logger.get('SolicitationModal.ts');

class SolicitationModal extends Component<ServiceProps, State> {
  constructor(props: ServiceProps) {
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

            <button onClick={this.handleDonate} className={'btn btn-primary'}>
              Faire un don
            </button>
            <button onClick={this.handleDonate} className={'btn btn-link'}>
              A quoi ça sert ?
            </button>
          </div>

          <div className={'mt-5 mx-4 text-center'}>
            <p>Comment ça c&apos;est passé ? Faites le savoir ! </p>
          </div>

          <div className={'d-flex flex-row justify-content-center mb-4'}>
            <button onClick={() => this.handleVote(VoteValue.NOT_SATISFIED)} className={`btn btn-outline-primary ${Cls.voteBtn}`}>
              <i className={'fa fa-frown'} />
              Pas bien
            </button>
            <button onClick={() => this.handleVote(VoteValue.BLAH)} className={`btn btn-outline-primary ${Cls.voteBtn}`}>
              <i className={'fa fa-meh'} />
              Bof ...
            </button>
            <button onClick={() => this.handleVote(VoteValue.SATISFIED)} className={`btn btn-outline-primary ${Cls.voteBtn}`}>
              <i className={'fa fa-smile-beam'} />
              Bien !
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

    const listener: ModalEventListener = () => {
      const title = _.sample(Titles);
      const encouragement = _.sample(Encouragements);
      this.setState({ visible: true, title, encouragement });
    };

    modals.addListener(ModalEventType.ShowSolicitation, listener);
    this.setState({ listener });
  }

  public componentWillUnmount() {
    const { modals } = this.props.services;

    if (this.state.listener) {
      modals.removeListener(ModalEventType.ShowSolicitation, this.state.listener);
    }
  }

  private handleVote = (value: VoteValue) => {
    const { toasts, vote } = this.props.services;
    vote.vote(value).catch((err) => logger.error('Error while voting: ', err));

    toasts.info('Merci pour votre participation !');
    this.close();
  };

  private handleDonate = () => {
    const { toasts } = this.props.services;
    toasts.featureNotReady();
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

export default withServices(SolicitationModal);
