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

import Cls from './ShareSettingsView.module.scss';
import React, { useEffect, useRef } from 'react';
import { pageSetup } from '../../core/utils/page-setup';
import { Logger } from '@abc-map/shared';
import { useAppSelector } from '../../core/store/hooks';
import { EnableSharePanel } from './enable-share-panel/EnableSharePanel';
import SharingLayoutMap from './sharing-layout-map/SharingLayoutMap';
import { prefixedTranslation } from '../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import { HistoryKeyboardListener } from '../../core/ui/HistoryKeyboardListener';
import { HistoryKey } from '../../core/history/HistoryKey';

const logger = Logger.get('ShareSettingsView.tsx');

const t = prefixedTranslation('ShareSettingsView:');

function ShareSettingsView() {
  // User status, project status
  const mapShared = useAppSelector((st) => st.project.metadata.public);
  const keyboardListener = useRef<HistoryKeyboardListener>();

  // Page setup on mount
  useEffect(() => pageSetup(t('Share'), t('Share_your_maps_online')), []);

  useEffect(() => {
    keyboardListener.current = HistoryKeyboardListener.create(HistoryKey.SharedViews);
    keyboardListener.current?.initialize();

    return () => keyboardListener.current?.destroy();
  }, []);

  return (
    <div className={Cls.shareSettings}>
      {/* User is not authenticated or map is not shared, we show informations and settings */}
      {!mapShared && <EnableSharePanel />}
      {mapShared && <SharingLayoutMap />}
    </div>
  );
}

export default withTranslation()(ShareSettingsView);
