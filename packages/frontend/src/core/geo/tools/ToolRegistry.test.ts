import { MapTool } from '@abc-map/shared-entities';
import { ToolRegistry } from './ToolRegistry';
import { Selection } from './Selection';

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
    expect(tool).toBeInstanceOf(Selection);
  });

  it('get tool should throw', () => {
    expect(() => {
      ToolRegistry.getById('wrong tool' as any);
    }).toThrow('Tool not found: wrong tool');
  });
});
