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

import { useEffect } from 'react';
import { Env } from '../../core/utils/Env';
import { prefixedTranslation } from '../../i18n/i18n';
import { useExperimentalFeature } from '../../core/ui/useExperimentalFeature';
import { DisableWarningBeforeUnload } from '../../experimental-features';

const t = prefixedTranslation('WarningBeforeUnload:');

export function WarningBeforeUnload() {
  const disabled = useExperimentalFeature(DisableWarningBeforeUnload);

  useEffect(() => {
    // Warning is never enabled in E2E tests
    if (Env.isE2e()) {
      return;
    }

    if (disabled) {
      return;
    }

    const warning = (ev: BeforeUnloadEvent | undefined): string => {
      const message = t('Modification_in_progress_will_be_lost');
      if (ev) {
        ev.returnValue = message;
      }
      return message;
    };

    window.addEventListener('beforeunload', warning);
    window.addEventListener('unload', warning);

    return () => {
      window.removeEventListener('beforeunload', warning);
      window.removeEventListener('unload', warning);
    };
  }, [disabled]);

  return <></>;
}
