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
import { Logger } from '@abc-map/shared';
import { VoteValue } from '@abc-map/shared';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import FundingLinks from '../funding-links/FundingLinks';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './SolicitationModal.module.scss';
import { Routes } from '../../routes';

const logger = Logger.get('SolicitationModal.ts');

declare type Props = ServiceProps & RouteComponentProps;

interface State {
  visible: boolean;
  voteDone: boolean;
}

const t = prefixedTranslation('SolicitationModal:');

class SolicitationModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { visible: false, voteDone: false };
  }

  public render(): ReactNode {
    const visible = this.state.visible;
    const voteDone = this.state.voteDone;
    if (!visible) {
      return <div />;
    }

    return (
      <Modal show={visible} onHide={this.close} size={'lg'} backdrop={'static'}>
        <Modal.Header closeButton>
          <Modal.Title>{t('So_how_was_it')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4 className={'text-center m-4'}>{t('Support_your_software')} ✊</h4>

          <div className={'border rounded m-4 p-3 d-flex flex-column justify-content-center align-items-center mb-2'}>
            <FundingLinks />

            <button onClick={this.handleDonate} className={'btn btn-link mt-4'}>
              {t('What_are_donations_used_for')}
            </button>
          </div>

          {!voteDone && (
            <>
              <div className={'mt-5 mx-4 text-center'}>
                <p>{t('How_did_it_go')}</p>
              </div>
              <div className={'d-flex flex-row justify-content-center mb-4'}>
                <button onClick={() => this.handleVote(VoteValue.SATISFIED)} className={`btn btn-outline-primary ${Cls.voteBtn}`}>
                  <span className={Cls.face}>🥰</span>
                  {t('Well')}
                </button>
                <button onClick={() => this.handleVote(VoteValue.BLAH)} className={`btn btn-outline-primary ${Cls.voteBtn}`}>
                  <span className={Cls.face}>😐</span>
                  {t('Blah')}
                </button>
                <button onClick={() => this.handleVote(VoteValue.NOT_SATISFIED)} className={`btn btn-outline-primary ${Cls.voteBtn}`}>
                  <span className={Cls.face}>😞</span>
                  {t('Not_good')}
                </button>
              </div>
            </>
          )}

          {voteDone && (
            <div className={'d-flex flex-column justify-content-center align-items-center my-5'}>
              <h5>{t('Thanks_for_your_feedback')} 👍️</h5>
              <h5>{t('Support_project')} ⬆</h5>
            </div>
          )}

          <div className={'d-flex justify-content-end'}>
            <button className={'btn btn-outline-secondary'} onClick={this.close} data-cy={'close-solicitation-modal'}>
              {t('Close')}
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
    this.setState({ visible: true, voteDone: false });
  };

  private handleVote = (value: VoteValue) => {
    const { vote } = this.props.services;
    // We do not wait for vote
    vote.vote(value).catch((err) => logger.error('Error while voting: ', err));
    this.setState({ voteDone: true });
  };

  private handleDonate = () => {
    const { history } = this.props;
    history.push(Routes.funding().format());
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

export default withTranslation()(withRouter(withServices(SolicitationModal)));
