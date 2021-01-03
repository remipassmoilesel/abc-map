import { MainStore } from '../../store/store';
import { HistoryService } from '../../history/HistoryService';
import { Map } from 'ol';
import VectorSource from 'ol/source/Vector';
import { OlTestHelper } from '../../utils/OlTestHelper';
import { Selection } from './Selection';

describe('Selection', () => {
  it('setup()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = new Map({});
    const source = new VectorSource();

    const circle = new Selection(store, history);
    circle.setup(map, source);

    expect(circle.getMap()).toStrictEqual(map);
    expect(circle.getSource()).toStrictEqual(source);
    const interactions = OlTestHelper.getInteractionNames(map);
    expect(interactions).toContain('DragBox');
  });

  it('dispose()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = new Map({});
    const source = new VectorSource();

    const circle = new Selection(store, history);
    circle.setup(map, source);
    circle.dispose();

    const interactions = OlTestHelper.getInteractionNames(map);
    expect(interactions).not.toContain('DragBox');
  });
});
