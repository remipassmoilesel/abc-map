import { MainStore } from '../../../store/store';
import { HistoryService } from '../../../history/HistoryService';
import { Map } from 'ol';
import VectorSource from 'ol/source/Vector';
import { OlTestHelper } from '../../../utils/OlTestHelper';
import { SelectionTool } from './SelectionTool';

describe('Selection', () => {
  it('setup()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = new Map({});
    const source = new VectorSource();

    const tool = new SelectionTool(store, history);
    tool.setup(map, source);

    expect(tool.getMap()).toStrictEqual(map);
    expect(tool.getSource()).toStrictEqual(source);
    const interactions = OlTestHelper.getInteractionNames(map);
    expect(interactions).toContain('DragBox');
  });

  it('dispose()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = new Map({});
    const source = new VectorSource();

    const tool = new SelectionTool(store, history);
    tool.setup(map, source);
    tool.dispose();

    const interactions = OlTestHelper.getInteractionNames(map);
    expect(interactions).not.toContain('DragBox');
  });
});
