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

import React, { useCallback, useEffect, useState } from 'react';
import * as Bowser from 'bowser';
import mainLogo from '../../assets/main-icon.png';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './DeviceWarningModal.module.scss';

const t = prefixedTranslation('DeviceWarningModal:');

function DeviceWarningModal() {
  const [visible, setVisible] = useState(false);

  const isOptimalDevice = useCallback(() => {
    const browser = Bowser.getParser(window.navigator.userAgent);
    const deviceSupported = browser.getPlatform().type === 'desktop';
    const browserSupported = ['chrome', 'electron', 'firefox'].indexOf(browser.getBrowserName(true)) !== -1;
    const screenSizeSupported = window.innerWidth >= 1366 && window.innerHeight >= 768;
    return deviceSupported && browserSupported && screenSizeSupported;
  }, []);

  useEffect(() => {
    if (!isOptimalDevice()) {
      setVisible(true);
    }
  }, [isOptimalDevice]);

  if (!visible) {
    return <div />;
  }

  return (
    <div className={Cls.modal}>
      <img src={mainLogo} alt={'Abc-Map'} />

      <div className={Cls.title}>{t('Hello')} 👋</div>
      <div className={Cls.explanation1} data-cy={'device-warning'} dangerouslySetInnerHTML={{ __html: t('AbcMap_is_designed_for_desktop_computers') }} />
      <div className={Cls.explanation2}>{t('You_may_come_across_some_bugs')} 🐛</div>

      <div className={'d-flex justify-content-end m-5'}>
        <button onClick={() => setVisible(false)} className={'btn btn-primary'} data-cy="device-warning-confirm">
          {t('I_understand')}
        </button>
      </div>
    </div>
  );
}

export default withTranslation()(DeviceWarningModal);
