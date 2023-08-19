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

import Cls from './LargeOfflineIndicator.module.scss';
import { prefixedTranslation } from '../../i18n/i18n';
import clsx from 'clsx';
import OfflineIcon from './offline.svg';
import { useOnlineStatus } from '../../core/pwa/OnlineStatusContext';
import { ReactNode } from 'react';

const t = prefixedTranslation('LargeOfflineIndicator:');

interface Props {
  className?: string;
  children?: ReactNode;
}

export function LargeOfflineIndicator(props: Props) {
  const { children, className } = props;
  const online = useOnlineStatus();

  if (online) {
    return <></>;
  }

  return (
    <div className={clsx(Cls.indicator, className)}>
      <div className={Cls.inner}>
        <img src={OfflineIcon} alt={t('You_are_offline')} />
        <h1 className={'mb-4'}>{t('You_are_offline')}</h1>

        <div className={Cls.children}>{children}</div>
      </div>
    </div>
  );
}
