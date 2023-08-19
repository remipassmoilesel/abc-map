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

import { IconDefs } from '../../../components/icon/IconDefs';
import React, { CSSProperties, useCallback } from 'react';
import { useServices } from '../../../core/useServices';
import { Logger } from '@abc-map/shared';
import { FloatingButton } from '../../../components/floating-button/FloatingButton';
import { prefixedTranslation } from '../../../i18n/i18n';
import { useFullscreen } from '../../../core/ui/useFullscreen';

const logger = Logger.get('FullscreenButton.tsx');

const t = prefixedTranslation('MapView:');

interface Props {
  style: CSSProperties;
}

export function FullscreenButton(props: Props) {
  const { style } = props;
  const { toasts } = useServices();
  const { fullscreen, toggleFullscreen } = useFullscreen();

  const handleToggleFullscreen = useCallback(() => {
    toggleFullscreen().catch((err) => {
      logger.error('Fullscreen error: ', err);
      toasts.genericError();
    });
  }, [toasts, toggleFullscreen]);

  const icon = fullscreen ? IconDefs.faCompressAlt : IconDefs.faExpandAlt;

  return <FloatingButton icon={icon} title={t('Fullscreen')} onClick={handleToggleFullscreen} style={style} />;
}
