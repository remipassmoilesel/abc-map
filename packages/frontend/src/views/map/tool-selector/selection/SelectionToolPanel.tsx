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
import StrokeWidthSelector from '../_common/stroke-width-selector/StrokeWidthSelector';
import ColorSelector from '../../../../components/color-picker/ColorSelector';
import FillPatternSelector from '../_common/fill-pattern-selector/FillPatternSelector';
import TextFormat from '../_common/text-format/TextFormat';
import TipBubble from '../../../../components/tip-bubble/TipBubble';
import { ToolTips } from '@abc-map/user-documentation';
import PointIconSelector from '../point/icon-selector/PointIconSelector';
import PointSizeSelector from '../point/size-selector/PointSizeSelector';
import ButtonBar from '../_common/button-bar/ButtonBar';
import Cls from './SelectionToolPanel.module.scss';

const logger = Logger.get('SelectionToolPanel.tsx');

class SelectionToolPanel extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={Cls.selectionPanel}>
        <TipBubble id={ToolTips.Selection} label={"Aide de l'outil"} className={'mx-3 mb-3'} />
        <ButtonBar />

        <div className={Cls.section}>Points</div>
        <PointIconSelector />
        <PointSizeSelector />
        <ColorSelector point={true} />

        <div className={Cls.section}>Lignes et polygones</div>
        <StrokeWidthSelector />
        <ColorSelector point={false} stroke={true} fillColor1={true} fillColor2={true} />
        <FillPatternSelector />

        <div className={Cls.section}>Texte</div>
        <TextFormat />
      </div>
    );
  }
}

export default SelectionToolPanel;
