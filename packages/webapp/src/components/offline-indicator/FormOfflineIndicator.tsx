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

import Cls from './FormOfflineIndicator.module.scss';
import { useOnlineStatus } from '../../core/pwa/OnlineStatusContext';
import { prefixedTranslation } from '../../i18n/i18n';
import OfflineIcon from './offline.svg';
import clsx from 'clsx';

const t = prefixedTranslation('FormOfflineIndicator:');

export function FormOfflineIndicator() {
  const online = useOnlineStatus();

  // User is online, nothing to show
  if (online) {
    return <></>;
  }

  // User is offline, we show a warning
  return (
    <div className={clsx('alert alert-info my-3', Cls.indicator)}>
      <img src={OfflineIcon} alt={t('You_are_offline')} />
      {t('You_are_offline')}
    </div>
  );
}
