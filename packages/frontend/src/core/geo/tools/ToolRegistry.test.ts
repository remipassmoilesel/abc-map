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

import { MapTool } from '@abc-map/frontend-commons';
import { ToolRegistry } from './ToolRegistry';
import { SelectionTool } from './selection/SelectionTool';

describe('ToolRegistry', () => {
  it('All tool should be registered', () => {
    const registryIds = ToolRegistry.getAll()
      .map((t) => t.getId())
      .sort();
    const toolIds: string[] = Object.values(MapTool).sort();
    expect(registryIds).toEqual(toolIds);
  });

  it('get tool should work', () => {
    const tool = ToolRegistry.getById(MapTool.Selection);
    expect(tool).toBeInstanceOf(SelectionTool);
  });

  it('get tool should throw', () => {
    expect(() => {
      ToolRegistry.getById('wrong tool' as any);
    }).toThrow('Tool not found: wrong tool');
  });
});
