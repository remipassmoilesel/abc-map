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

import { withTranslation } from 'react-i18next';
import { ToolMode } from '../../../../../core/tools/ToolMode';
import { Switch } from '../../../../../components/switch/Switch';
import KeyboardKey from './KeyboardKey';
import { useCallback } from 'react';
import { prefixedTranslation } from '../../../../../i18n/i18n';

const t = prefixedTranslation('MapView:ToolModeSelector.');
const tModes = prefixedTranslation('core:toolModes.');

interface Props {
  mode: ToolMode;
  value: boolean;
  onSelect: (mode: ToolMode) => void;
}

function ToolModeSwitch(props: Props) {
  const { mode, value, onSelect } = props;
  const keys = mode.shortcut.split(/( +|\+)/i);
  const handleToggle = useCallback(() => onSelect(mode), [mode, onSelect]);

  return (
    <div onClick={handleToggle} data-cy={`tool-mode-${mode.name.toLocaleLowerCase()}`} className={'cursor-pointer d-flex align-items-center mb-2'}>
      <div className={'flex-grow-1'}>{tModes(mode.i18nLabel)}</div>
      {keys.map((k, i) => (
        <KeyboardKey key={k + i} label={k} className={'mr-2'} title={t('Keyboard_shortcut', { shortcut: mode.shortcut.toLocaleUpperCase() })} />
      ))}
      <Switch onChange={handleToggle} value={value} />
    </div>
  );
}

export default withTranslation()(ToolModeSwitch);
