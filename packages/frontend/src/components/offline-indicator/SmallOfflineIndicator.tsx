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

import Cls from './SmallOfflineIndicator.module.scss';
import { WithTooltip } from '../with-tooltip/WithTooltip';
import { prefixedTranslation } from '../../i18n/i18n';
import clsx from 'clsx';
import OfflineIcon from './offline.svg';
import { useOnlineStatus } from '../../core/pwa/OnlineStatusContext';

const t = prefixedTranslation('SmallOfflineIndicator:');

interface Props {
  className?: string;
}

export function SmallOfflineIndicator(props: Props) {
  const { className } = props;
  const online = useOnlineStatus();

  if (online) {
    return <></>;
  }

  return (
    <div className={clsx(Cls.indicator, className)}>
      <WithTooltip title={t('You_are_not_connected_to_the_Internet')}>
        <div className={Cls.inner}>
          <img src={OfflineIcon} alt={t('Offline')} />
          {t('Offline')}
        </div>
      </WithTooltip>
    </div>
  );
}
