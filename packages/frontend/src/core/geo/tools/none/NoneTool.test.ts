import { MainStore } from '../../../store/store';
import { HistoryService } from '../../../history/HistoryService';
import VectorSource from 'ol/source/Vector';
import { MapFactory } from '../../map/MapFactory';
import { TestHelper } from '../../../utils/TestHelper';
import { NoneTool } from './NoneTool';

describe('NoneTool', () => {
  it('setup()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = MapFactory.createNaked().unwrap();
    const source = new VectorSource();

    const tool = new NoneTool(store, history);
    tool.setup(map, source);

    expect(TestHelper.interactionNames(map)).toEqual(['DoubleClickZoom', 'DragPan', 'KeyboardPan', 'MouseWheelZoom']);
  });

  it('dispose()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = MapFactory.createNaked().unwrap();
    const source = new VectorSource();

    const tool = new NoneTool(store, history);
    tool.setup(map, source);
    tool.dispose();

    expect(TestHelper.interactionNames(map)).toEqual([]);
  });
});
