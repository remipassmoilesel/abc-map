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

import { Tool } from '../../../core/tools/Tool';
import React, { useCallback } from 'react';
import { MapTool } from '@abc-map/shared';
import { prefixedTranslation } from '../../../i18n/i18n';
import Cls from './ToolButton.module.scss';
import { WithTooltip } from '../../../components/with-tooltip/WithTooltip';

interface Props {
  tool: Tool;
  active: boolean;
  onSelect: (tool: MapTool) => void;
}

const t = prefixedTranslation('core:tools.');

export function ToolButton(props: Props) {
  const { tool, active, onSelect } = props;
  const classes = active ? `${Cls.toolButton} ${Cls.active}` : Cls.toolButton;

  const handleSelect = useCallback(() => {
    onSelect(tool.getId());
  }, [onSelect, tool]);

  return (
    <WithTooltip title={t(tool.getI18nLabel())} placement={'left'}>
      <button
        onClick={handleSelect}
        className={classes}
        data-cy={`tool-${tool.getId().toLocaleLowerCase()}`}
        data-active={active}
        dangerouslySetInnerHTML={{ __html: tool.getIcon() }}
      />
    </WithTooltip>
  );
}
