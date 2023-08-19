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

import Cls from './DeviceWarningModal.module.scss';
import React, { useEffect, useState } from 'react';
import * as Bowser from 'bowser';
import mainLogo from '../../assets/main-icon.png';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../core/store/hooks';
import { UiActions } from '../../core/store/ui/actions';
import { FullscreenModal } from '../fullscreen-modal/FullscreenModal';

const t = prefixedTranslation('DeviceWarningModal:');

function DeviceWarningModal() {
  const [visible, setVisible] = useState(false);
  const alreadyShown = useAppSelector((st) => st.ui.informations.riskyDevice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    function isRiskyDevice() {
      const bowser = Bowser.getParser(window.navigator.userAgent);
      const platformUnsupported = bowser.getPlatform().type !== 'desktop';
      const browserNotSupported = ['chrome', 'electron', 'firefox'].indexOf(bowser.getBrowserName(true)) === -1;
      const windowTooSmall = window.innerWidth < 1366 || window.innerHeight < 768;
      const windowTooBig = window.innerWidth >= 2560 || window.innerHeight >= 1440;
      return platformUnsupported || browserNotSupported || windowTooSmall || windowTooBig;
    }

    if (!alreadyShown && isRiskyDevice()) {
      setVisible(true);
      dispatch(UiActions.ackInformation('riskyDevice'));
    }
  }, [alreadyShown, dispatch]);

  if (!visible) {
    return <div />;
  }

  return (
    <FullscreenModal className={Cls.modal}>
      <img src={mainLogo} alt={'Abc-Map'} />

      <h1 className={Cls.title}>{t('Hello')} 👋</h1>
      <div className={Cls.explanation1} data-cy={'device-warning'} dangerouslySetInnerHTML={{ __html: t('AbcMap_is_designed_for_desktop_computers') }} />
      <div className={Cls.explanation2}>{t('You_may_come_across_some_bugs')} 🐛</div>

      <div className={'d-flex justify-content-end m-5'}>
        <button onClick={() => setVisible(false)} className={'btn btn-primary'} data-cy="device-warning-confirm">
          {t('I_understand')}
        </button>
      </div>
    </FullscreenModal>
  );
}

export default withTranslation()(DeviceWarningModal);
