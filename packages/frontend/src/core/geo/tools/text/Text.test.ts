import { MainStore } from '../../../store/store';
import { HistoryService } from '../../../history/HistoryService';
import { Map } from 'ol';
import VectorSource from 'ol/source/Vector';
import { OlTestHelper } from '../../../utils/OlTestHelper';
import { Text } from './Text';

describe('Selection', () => {
  it('setup()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = new Map({});
    const source = new VectorSource();

    const text = new Text(store, history);
    text.setup(map, source);

    expect(text.getMap()).toStrictEqual(map);
    expect(text.getSource()).toStrictEqual(source);
    const interactions = OlTestHelper.getInteractionNames(map);
    expect(interactions).toContain('TextInteraction');
  });

  it('dispose()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = new Map({});
    const source = new VectorSource();

    const text = new Text(store, history);
    text.setup(map, source);
    text.dispose();

    const interactions = OlTestHelper.getInteractionNames(map);
    expect(interactions).not.toContain('TextInteraction');
  });
});
