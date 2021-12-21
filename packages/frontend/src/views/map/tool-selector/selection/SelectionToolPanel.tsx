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

import React from 'react';
import { Logger } from '@abc-map/shared';
import StrokeWidthSelector from '../_common/stroke-width-selector/StrokeWidthSelector';
import ColorSelector from '../../../../components/color-picker/ColorSelector';
import FillPatternSelector from '../_common/fill-pattern-selector/FillPatternSelector';
import TextFormat from '../_common/text-format/TextFormat';
import PointIconSelector from '../point/icon-selector/PointIconSelector';
import PointSizeSelector from '../point/size-selector/PointSizeSelector';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './SelectionToolPanel.module.scss';

const logger = Logger.get('SelectionToolPanel.tsx');

const t = prefixedTranslation('MapView:ToolSelector.');

function SelectionToolPanel() {
  return (
    <div className={Cls.selectionPanel}>
      <div className={Cls.section}>
        <div className={Cls.title}>{t('Points')}</div>
        <PointIconSelector />
        <PointSizeSelector />
        <ColorSelector point={true} />
      </div>

      <div className={Cls.section}>
        <div className={Cls.title}>{t('Lines_and_polygons')}</div>
        <StrokeWidthSelector />
        <ColorSelector point={false} stroke={true} fillColor1={true} fillColor2={true} />
        <FillPatternSelector />
      </div>

      <div className={Cls.section}>
        <div className={Cls.title}>{t('Text')}</div>
        <TextFormat />
      </div>
    </div>
  );
}

export default withTranslation()(SelectionToolPanel);
