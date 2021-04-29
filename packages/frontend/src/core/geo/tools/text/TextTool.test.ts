import { MainStore } from '../../../store/store';
import { HistoryService } from '../../../history/HistoryService';
import { Map } from 'ol';
import VectorSource from 'ol/source/Vector';
import { TextTool } from './TextTool';
import { TestHelper } from '../../../utils/TestHelper';

describe('Text', () => {
  it('setup()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = new Map({});
    const source = new VectorSource();

    const text = new TextTool(store, history);
    text.setup(map, source);

    expect(text.getMap()).toStrictEqual(map);
    expect(text.getSource()).toStrictEqual(source);
    const interactions = TestHelper.interactionNames(map);
    expect(interactions).toContain('TextInteraction');
  });

  it('dispose()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = new Map({});
    const source = new VectorSource();

    const text = new TextTool(store, history);
    text.setup(map, source);
    text.dispose();

    const interactions = TestHelper.interactionNames(map);
    expect(interactions).not.toContain('TextInteraction');
  });
});
