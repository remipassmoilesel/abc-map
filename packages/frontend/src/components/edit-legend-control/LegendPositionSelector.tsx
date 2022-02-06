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

import React, { ChangeEvent, useCallback } from 'react';
import { LabeledLegendDisplays } from '../../views/export/export-controls/LabeledLegendDisplay';
import { prefixedTranslation } from '../../i18n/i18n';
import { useMapLegend } from '../../core/project/useMapLegend';
import { Logger } from '@abc-map/shared';
import { useServices } from '../../core/useServices';
import clsx from 'clsx';

const logger = Logger.get('LegendPositionSelector.tsx');

const t = prefixedTranslation('EditLegendControl:');

interface Props {
  legendId: string | undefined;
  className?: string;
}

export function LegendPositionSelector(props: Props) {
  const { project } = useServices();
  const { legendId, className } = props;
  const legend = useMapLegend(legendId);
  const display = legend?.display;

  // User changed legend position
  const handleChanged = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      const value = ev.target.value;
      const display = LabeledLegendDisplays.All.find((fmt) => fmt.value === value)?.value;
      if (!display) {
        logger.error(`Display not found: ${value}`);
        return;
      }

      if (!legend) {
        logger.error('Legend not ready');
        return;
      }

      project.setLegendDisplay(legend.id, display);
    },
    [legend, project]
  );

  return (
    <select onChange={handleChanged} value={display} className={clsx('form-select', className)} data-cy={'legend-position-selector'}>
      <option>...</option>
      {LabeledLegendDisplays.All.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {t(opt.i18nLabel)}
        </option>
      ))}
    </select>
  );
}
