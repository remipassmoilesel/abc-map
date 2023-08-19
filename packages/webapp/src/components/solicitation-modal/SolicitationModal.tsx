/**
 * Copyright © 2023 Rémi Pace.
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

import Cls from './SolicitationModal.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import { ModalEventType, ModalStatus } from '../../core/ui/typings';
import { Logger, VoteValue } from '@abc-map/shared';
import { FundingLinks } from '../funding-links/FundingLinks';
import { useTranslation } from 'react-i18next';
import { Routes } from '../../routes';
import { FullscreenModal } from '../fullscreen-modal/FullscreenModal';
import TextFeedbackForm from '../feedback/form/TextFeedbackForm';
import { confetti } from '../../core/ui/confetti';
import { useServices } from '../../core/useServices';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../../core/budget/useBudget';
import clsx from 'clsx';

const logger = Logger.get('SolicitationModal.ts');

export function SolicitationModal() {
  const { t } = useTranslation('SolicitationModal');
  const [visible, setVisible] = useState(false);
  const [voteValue, setVoteValue] = useState<VoteValue | undefined>(undefined);
  const { modals, feedback } = useServices();
  const navigate = useNavigate();

  const { readableTotal, totalTheme } = useBudget();

  useEffect(() => {
    const handleOpen = () => {
      setVisible(true);
      setVoteValue(undefined);
    };

    modals.addListener(ModalEventType.ShowSolicitation, handleOpen);
    return () => modals.removeListener(ModalEventType.ShowSolicitation, handleOpen);
  }, [modals]);

  const close = useCallback(() => {
    modals.dispatch({
      type: ModalEventType.SolicitationClosed,
      status: ModalStatus.Confirmed,
    });

    setVisible(false);
  }, [modals]);

  const handleVote = useCallback(
    (value: VoteValue) => {
      // We do not wait for vote
      feedback.vote(value).catch((err) => logger.error('Error while voting: ', err));
      setVoteValue(value);

      if (value > VoteValue.BLAH) {
        confetti();
      }
    },
    [feedback]
  );

  const handleExplainDonation = useCallback(() => {
    navigate(Routes.funding().format());
    close();
  }, [close, navigate]);

  const voteDone = typeof voteValue !== 'undefined';

  if (!visible) {
    return <div></div>;
  }

  return (
    <FullscreenModal className={Cls.modal}>
      <h1>{t('So_how_was_it')}</h1>

      <div className={Cls.centerFrame}>
        <h4 className={'text-center fs-20 mb-5'}>{t('Support_your_software')} ✊</h4>

        <FundingLinks />

        <h5 onClick={handleExplainDonation} className={'cursor-pointer'}>
          {t('For_the_moment_the_budget_is')}
        </h5>
        <h2 onClick={handleExplainDonation} className={clsx(totalTheme, 'fw-bold cursor-pointer mb-4')}>
          {readableTotal}
        </h2>

        <button onClick={handleExplainDonation} className={'btn btn-link mt-3'}>
          {t('What_are_donations_used_for')}
        </button>
      </div>

      {!voteDone && (
        <div className={'d-flex flex-column'}>
          <h4 className={'mx-4 mb-3 text-center'}>{t('How_did_it_go')}</h4>
          <div className={'d-flex flex-row justify-content-center mb-4'}>
            <button onClick={() => handleVote(VoteValue.SATISFIED)} className={`btn btn-outline-primary ${Cls.voteBtn}`}>
              <span className={Cls.face}>🥰</span>
              {t('Well')}
            </button>
            <button onClick={() => handleVote(VoteValue.BLAH)} className={`btn btn-outline-primary ${Cls.voteBtn}`}>
              <span className={Cls.face}>😐</span>
              {t('Blah')}
            </button>
            <button onClick={() => handleVote(VoteValue.NOT_SATISFIED)} className={`btn btn-outline-primary ${Cls.voteBtn}`}>
              <span className={Cls.face}>😞</span>
              {t('Not_good')}
            </button>
          </div>
        </div>
      )}

      {voteDone && voteValue && voteValue < VoteValue.SATISFIED && (
        <div className={Cls.feedbackArea}>
          <h5>{t('What_happened')}</h5>
          <TextFeedbackForm onCancel={close} onDone={close} className={'mt-4'} />
        </div>
      )}

      {voteDone && voteValue && voteValue === VoteValue.SATISFIED && (
        <div className={Cls.feedbackArea}>
          <h5>{t('Thanks_for_your_feedback')} 👍️</h5>
          <h5>{t('Support_project')} ⬆</h5>
        </div>
      )}

      <button className={`btn btn-outline-secondary`} onClick={close} data-cy={'close-solicitation-modal'}>
        {t('Close')}
      </button>
    </FullscreenModal>
  );
}
