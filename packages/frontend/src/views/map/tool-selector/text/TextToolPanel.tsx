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
import { Logger } from '@abc-map/frontend-commons';
import TextFormat from '../_common/text-format/TextFormat';
import TipBubble from '../../../../components/tip-bubble/TipBubble';
import { ToolTips } from '@abc-map/documentation';
import './TextToolPanel.scss';

const logger = Logger.get('TextToolPanel.tsx');

class TextToolPanel extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={'abc-text-panel'}>
        <TipBubble id={ToolTips.Text} label={'Aide'} className={'mx-3 mb-4'} />
        <TextFormat />
      </div>
    );
  }
}

export default TextToolPanel;
