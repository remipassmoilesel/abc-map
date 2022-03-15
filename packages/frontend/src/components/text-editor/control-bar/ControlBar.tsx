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

import Cls from './ControlBar.module.scss';
import { withTranslation } from 'react-i18next';
import { BlockSelector } from './block-selector/BlockSelector';
import { StyleControls } from './style-controls/StyleControls';
import { ColorSelector } from './color-selector/ColorSelector';
import { TableControls } from './table-controls/TableControls';
import { EmbedMedia } from './embed-media/EmbedMedia';
import { UndoRedoControls } from './undo-redo/UndoRedoControls';
import { MapSymbol } from './map-symbol/MapSymbol';
import { AlignmentSelector } from './alignment-selector/AlignmentSelector';
import clsx from 'clsx';
import { LinkControls } from './link-controls/LinkControls';

interface Props {
  className?: string;
}

function ControlBar(props: Props) {
  const { className } = props;

  return (
    <div className={clsx(Cls.controlBar, className)}>
      <BlockSelector className={'mr-4'} />
      <StyleControls />
      <ColorSelector className={'mx-4'} />
      <AlignmentSelector />
      <TableControls />
      <EmbedMedia />
      <LinkControls />
      <MapSymbol />
      <UndoRedoControls className={'mx-4'} />
    </div>
  );
}

export default withTranslation()(ControlBar);
