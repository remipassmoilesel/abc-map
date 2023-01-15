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
import { ModalEventType, ModalStatus } from '../../core/ui/typings';
import { ServiceProps, withServices } from '../../core/withServices';
import { Logger } from '@abc-map/shared';
import { VoteValue } from '@abc-map/shared';
import FundingLinks from '../funding-links/FundingLinks';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './SolicitationModal.module.scss';
import { Routes } from '../../routes';
import { FullscreenModal } from '../fullscreen-modal/FullscreenModal';
import TextFeedbackForm from '../feedback/form/TextFeedbackForm';
import { confetti } from '../../core/ui/confetti';
import { withRouter, WithRouterProps } from '../../core/utils/withRouter';

const logger = Logger.get('SolicitationModal.ts');

declare type Props = ServiceProps & WithRouterProps;

interface State {
  visible: boolean;
  voteDone: boolean;
  voteValue?: VoteValue;
}

const t = prefixedTranslation('SolicitationModal:');

class SolicitationModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { visible: false, voteDone: false };
  }

  public render(): ReactNode {
    const { visible, voteDone, voteValue } = this.state;
    if (!visible) {
      return <div />;
    }

    return (
      <FullscreenModal className={Cls.modal}>
        <button className={`btn btn-outline-secondary ${Cls.closeButton}`} onClick={this.close} data-cy={'close-solicitation-modal'}>
          {t('Close')}
        </button>

        <h1>{t('So_how_was_it')}</h1>

        <div className={'border rounded p-4 d-flex flex-column justify-content-center align-items-center mb-5'}>
          <h4 className={'text-center mb-5'}>{t('Support_your_software')} ✊</h4>

          <FundingLinks />

          <button onClick={this.handleExplainDonation} className={'btn btn-link mt-3'}>
            {t('What_are_donations_used_for')}
          </button>
        </div>

        {!voteDone && (
          <div className={'d-flex flex-column'}>
            <h4 className={'mx-4 mb-3 text-center'}>{t('How_did_it_go')}</h4>
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
          </div>
        )}

        {voteDone && voteValue && voteValue < VoteValue.SATISFIED && (
          <div className={Cls.feedbackArea}>
            <h5>{t('What_happened')}</h5>
            <TextFeedbackForm onCancel={this.close} onDone={this.close} className={'mt-4'} />
          </div>
        )}
        {voteDone && voteValue && voteValue === VoteValue.SATISFIED && (
          <div className={Cls.feedbackArea}>
            <h5>{t('Thanks_for_your_feedback')} 👍️</h5>
            <h5>{t('Support_project')} ⬆</h5>
          </div>
        )}
      </FullscreenModal>
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
    const { feedback } = this.props.services;
    // We do not wait for vote
    feedback.vote(value).catch((err) => logger.error('Error while voting: ', err));
    this.setState({ voteDone: true, voteValue: value });

    if (value > VoteValue.BLAH) {
      confetti();
    }
  };

  private handleExplainDonation = () => {
    const { navigate } = this.props.router;

    navigate(Routes.funding().format());
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
