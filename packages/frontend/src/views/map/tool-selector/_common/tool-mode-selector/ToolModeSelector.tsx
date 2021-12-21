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

import ToolModeSwitch from './ToolModeSwitch';
import { withTranslation } from 'react-i18next';
import { ToolMode } from '../../../../../core/tools/ToolMode';
import { useCallback, useEffect, useState } from 'react';
import Mousetrap from 'mousetrap';
import { Logger } from '@abc-map/shared';
import { useServices } from '../../../../../core/hooks';

const logger = Logger.get('ToolModeSelector.tsx');

function ToolModeSelector() {
  const { geo } = useServices();
  const mainMap = geo.getMainMap();
  const [modes, setModes] = useState<ToolMode[]>([]);
  const [activeMode, setActiveMode] = useState<ToolMode | undefined>();

  // Listen tool changes and update UI
  const handleToolChange = useCallback(() => {
    setModes(mainMap.getTool()?.getModes() || []);
    setActiveMode(mainMap.getToolMode());
  }, [mainMap]);

  useEffect(() => {
    mainMap.addToolListener(handleToolChange);
    handleToolChange(); // We manually trigger the first setup

    return () => mainMap.removeToolListener(handleToolChange);
  }, [handleToolChange, mainMap]);

  // Bind / unbind keyboard shortcuts
  useEffect(() => {
    modes.forEach((mode) => {
      Mousetrap.bind(mode.shortcut, () => mainMap.setToolMode(mode));
    });

    return () => {
      modes.forEach((mode) => Mousetrap.unbind(mode.shortcut));
    };
  }, [geo, mainMap, modes]);

  // Change mode on click
  const handleModeSelected = useCallback((mode: ToolMode) => mainMap.setToolMode(mode), [mainMap]);

  return (
    <div className={'d-flex flex-column justify-content-start mt-2 mb-4 border-bottom'}>
      {modes.map((mode) => (
        <ToolModeSwitch key={mode.name} mode={mode} value={mode === activeMode} onSelect={handleModeSelected} />
      ))}
    </div>
  );
}

export default withTranslation()(ToolModeSelector);
