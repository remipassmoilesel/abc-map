import { MainStore } from '../../../store/store';
import { HistoryService } from '../../../history/HistoryService';
import { Map } from 'ol';
import VectorSource from 'ol/source/Vector';
import { OlTestHelper } from '../../../utils/OlTestHelper';
import { PolygonTool } from './PolygonTool';

describe('Polygon', () => {
  it('setup()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = new Map({});
    const source = new VectorSource();

    const tool = new PolygonTool(store, history);
    tool.setup(map, source);

    expect(tool.getMap()).toStrictEqual(map);
    expect(tool.getSource()).toStrictEqual(source);
    const interactions = OlTestHelper.getInteractionNames(map);
    expect(interactions).toContain('Draw');
    expect(interactions).toContain('Modify');
    expect(interactions).toContain('Snap');
    expect(map.getListeners('pointermove')).toHaveLength(1);
  });

  it('dispose()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = new Map({});
    const source = new VectorSource();

    const tool = new PolygonTool(store, history);
    tool.setup(map, source);
    tool.dispose();

    const interactions = OlTestHelper.getInteractionNames(map);
    expect(interactions).not.toContain('Draw');
    expect(interactions).not.toContain('Modify');
    expect(interactions).not.toContain('Snap');
    expect(map.getListeners('pointermove')).toBeUndefined();
  });
});
