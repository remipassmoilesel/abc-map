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

import { useCallback, useEffect } from 'react';
import { Env } from '../../core/utils/Env';
import { prefixedTranslation } from '../../i18n/i18n';

const t = prefixedTranslation('WarningBeforeUnload:');

export function WarningBeforeUnload() {
  const warnBeforeUnload = useCallback((ev: BeforeUnloadEvent | undefined): string => {
    const message = t('Modification_in_progress_will_be_lost');
    if (ev) {
      ev.returnValue = message;
    }
    return message;
  }, []);

  useEffect(() => {
    if (!Env.isE2e()) {
      window.addEventListener('beforeunload', warnBeforeUnload);
      window.addEventListener('unload', warnBeforeUnload);
    }

    return () => {
      if (!Env.isE2e()) {
        window.removeEventListener('beforeunload', warnBeforeUnload);
        window.removeEventListener('unload', warnBeforeUnload);
      }
    };
  }, [warnBeforeUnload]);

  return <></>;
}
