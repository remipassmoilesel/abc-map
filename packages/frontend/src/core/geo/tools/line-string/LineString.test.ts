import { MainStore } from '../../../store/store';
import { HistoryService } from '../../../history/HistoryService';
import { Map } from 'ol';
import VectorSource from 'ol/source/Vector';
import { OlTestHelper } from '../../../utils/OlTestHelper';
import { LineString } from './LineString';

describe('LineString', () => {
  it('setup()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = new Map({});
    const source = new VectorSource();

    const circle = new LineString(store, history);
    circle.setup(map, source);

    expect(circle.getMap()).toStrictEqual(map);
    expect(circle.getSource()).toStrictEqual(source);
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

    const circle = new LineString(store, history);
    circle.setup(map, source);
    circle.dispose();

    const interactions = OlTestHelper.getInteractionNames(map);
    expect(interactions).not.toContain('Draw');
    expect(interactions).not.toContain('Modify');
    expect(interactions).not.toContain('Snap');
    expect(map.getListeners('pointermove')).toBeUndefined();
  });
});
