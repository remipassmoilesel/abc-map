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

import { useCallback } from 'react';
import { FaIcon } from '../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../components/icon/IconDefs';
import { useServices } from '../../../../core/useServices';
import { easeOut } from 'ol/easing';
import { WithTooltip } from '../../../../components/with-tooltip/WithTooltip';
import { prefixedTranslation } from '../../../../i18n/i18n';
import Cls from './Zoom.module.scss';

const t = prefixedTranslation('MapView:MainMap.');

export function Zoom() {
  const { geo } = useServices();

  const zoom = useCallback(
    (delta: number) => {
      const view = geo.getMainMap().unwrap().getView();
      if (!view) {
        return;
      }

      const currentZoom = view.getZoom();
      if (currentZoom !== undefined) {
        const newZoom = view.getConstrainedZoom(currentZoom + delta);
        if (view.getAnimating()) {
          view.cancelAnimations();
        }

        view.animate({
          zoom: newZoom,
          duration: 250,
          easing: easeOut,
        });
      }
    },
    [geo]
  );

  const handleZoomOut = useCallback(() => {
    zoom(-1);
  }, [zoom]);

  const handleZoomIn = useCallback(() => {
    zoom(+1);
  }, [zoom]);

  return (
    <>
      <WithTooltip title={t('Zoom_out')} placement={'top'}>
        <button onClick={handleZoomOut} className={Cls.button}>
          <FaIcon icon={IconDefs.faMinus} size={'1.1rem'} className={Cls.icon} />
        </button>
      </WithTooltip>
      <WithTooltip title={t('Zoom_in')} placement={'top'}>
        <button onClick={handleZoomIn} className={Cls.button}>
          <FaIcon icon={IconDefs.faPlus} size={'1.1rem'} className={Cls.icon} />
        </button>
      </WithTooltip>
    </>
  );
}
