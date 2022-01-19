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

import { IconDefs } from '../../../components/icon/IconDefs';
import React, { CSSProperties, useCallback, useState } from 'react';
import { useServices } from '../../../core/useServices';
import { Logger } from '@abc-map/shared';
import { FloatingButton } from '../../../components/floating-button/FloatingButton';
import { prefixedTranslation } from '../../../i18n/i18n';

const logger = Logger.get('FullscreenButton.tsx');

const t = prefixedTranslation('MapView:FullscreenButton.');

interface Props {
  style: CSSProperties;
}

export function FullscreenButton(props: Props) {
  const { style } = props;
  const { toasts } = useServices();
  const [fullscreenIcon, setFullscreenIcon] = useState(document.fullscreenElement === null ? IconDefs.faExpandAlt : IconDefs.faCompressAlt);

  const toggleFullscreen = useCallback(() => {
    // Not in fullscreen, we enable it
    if (!document.fullscreenElement) {
      document.body
        .requestFullscreen()
        .then(() => setFullscreenIcon(IconDefs.faCompressAlt))
        .catch((err) => {
          logger.error('Cannot set fullscreen: ', err);
          toasts.genericError();
        });
    }

    // Already in fullscreen, we disable it
    else {
      document
        .exitFullscreen()
        .then(() => setFullscreenIcon(IconDefs.faExpandAlt))
        .catch((err) => {
          logger.error('Cannot exit fullscreen: ', err);
          toasts.genericError();
        });
    }
  }, [toasts]);

  return <FloatingButton buttonId={'map/FullscreenButton'} icon={fullscreenIcon} title={t('Fullscreen')} onClick={toggleFullscreen} style={style} />;
}
