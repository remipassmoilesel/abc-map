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

import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/shared';
import WidthSelector from '../_common/stroke-width-selector/StrokeWidthSelector';
import ColorSelector from '../../../../components/color-picker/ColorSelector';
import FillPatternSelector from '../_common/fill-pattern-selector/FillPatternSelector';
import TipBubble from '../../../../components/tip-bubble/TipBubble';
import { ToolTips } from '@abc-map/user-documentation';
import ButtonBar from '../_common/button-bar/ButtonBar';
import Cls from './PolygonToolPanel.module.scss';

const logger = Logger.get('PolygonToolPanel.tsx');

class PolygonToolPanel extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.polygonPanel}>
        <TipBubble id={ToolTips.Polygon} label={"Aide de l'outil"} className={'mx-3 mb-3'} />
        <ButtonBar />
        <WidthSelector />
        <ColorSelector stroke={true} fillColor1={true} fillColor2={true} />
        <FillPatternSelector />
      </div>
    );
  }
}

export default PolygonToolPanel;
