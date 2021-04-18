import { MainStore } from '../../../store/store';
import { HistoryService } from '../../../history/HistoryService';
import { Map } from 'ol';
import VectorSource from 'ol/source/Vector';
import { OlTestHelper } from '../../../utils/OlTestHelper';
import { RectangleTool } from './RectangleTool';

describe('Rectangle', () => {
  it('setup()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = new Map({});
    const source = new VectorSource();

    const rect = new RectangleTool(store, history);
    rect.setup(map, source);

    expect(rect.getMap()).toStrictEqual(map);
    expect(rect.getSource()).toStrictEqual(source);
    const interactions = OlTestHelper.getInteractionNames(map);
    expect(interactions).toContain('Draw');
  });

  it('dispose()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = new Map({});
    const source = new VectorSource();

    const rect = new RectangleTool(store, history);
    rect.setup(map, source);
    rect.dispose();

    const interactions = OlTestHelper.getInteractionNames(map);
    expect(interactions).not.toContain('Draw');
  });
});
