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

import Cls from './MeasuresToolPanel.module.scss';
import React, { useCallback } from 'react';
import { AbcGeometryType, Logger } from '@abc-map/shared';
import { withTranslation } from 'react-i18next';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { useServices } from '../../../../core/useServices';
import { formatArea, formatLength } from './helpers';
import TextFormat from '../_common/text-format/TextFormat';
import { FaIcon } from '../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../components/icon/IconDefs';
import clsx from 'clsx';

const logger = Logger.get('MeasuresToolPanel.tsx');

const t = prefixedTranslation('MapView:');

function MeasuresToolPanel() {
  const { geo } = useServices();

  const handleMeasureLengths = useCallback(() => {
    const layer = geo.getMainMap().getActiveLayer();
    if (!layer) {
      return;
    }

    geo.updateSelectedFeatures((style, feat) => {
      const geom = feat.getGeometry();
      if (!geom || !feat.hasGeometry(AbcGeometryType.LINE_STRING, AbcGeometryType.MULTI_LINE_STRING)) {
        return style;
      }

      const projection = layer.getProjection() || geo.getMainMap().getProjection();
      return {
        ...style,
        text: {
          ...style.text,
          value: formatLength(geom, projection),
        },
      };
    });
  }, [geo]);

  const handleMeasureAreas = useCallback(() => {
    const layer = geo.getMainMap().getActiveLayer();
    if (!layer) {
      return;
    }

    geo.updateSelectedFeatures((style, feat) => {
      const geom = feat.getGeometry();
      if (!geom || !feat.hasGeometry(AbcGeometryType.POLYGON, AbcGeometryType.MULTI_POLYGON)) {
        return style;
      }

      const projection = layer.getProjection() || geo.getMainMap().getProjection();
      return {
        ...style,
        text: {
          ...style.text,
          value: formatArea(geom, projection),
        },
      };
    });
  }, [geo]);

  return (
    <div className={Cls.measuresPanel}>
      <button onClick={handleMeasureLengths} className={clsx(Cls.button, 'btn btn-outline-primary')}>
        <FaIcon icon={IconDefs.faRuler} className={'mr-2'} />
        {t('Mesure_lengths')}
      </button>
      <button onClick={handleMeasureAreas} className={clsx(Cls.button, 'btn btn-outline-primary')}>
        <FaIcon icon={IconDefs.faDrawPolygon} className={'mr-2'} />
        {t('Mesure_areas')}
      </button>

      <TextFormat />
    </div>
  );
}

export default withTranslation()(MeasuresToolPanel);
