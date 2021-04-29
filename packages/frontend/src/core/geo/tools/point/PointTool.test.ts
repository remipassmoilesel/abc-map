import { MainStore } from '../../../store/store';
import { HistoryService } from '../../../history/HistoryService';
import VectorSource from 'ol/source/Vector';
import * as sinon from 'sinon';
import { MapFactory } from '../../map/MapFactory';
import { Snap } from 'ol/interaction';
import { TestHelper } from '../../../utils/TestHelper';
import { PointTool } from './PointTool';

describe('PointTool', () => {
  it('setup()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = MapFactory.createNaked().unwrap();
    const source = new VectorSource();

    const tool = new PointTool(store, history);
    tool.setup(map, source);

    expect(TestHelper.interactionNames(map)).toEqual(['DoubleClickZoom', 'DragPan', 'KeyboardPan', 'MouseWheelZoom', 'Modify', 'Draw', 'Snap', 'Select']);
  });

  it('dispose()', () => {
    const store = {} as MainStore;
    const history = {} as HistoryService;
    const map = MapFactory.createNaked().unwrap();
    const source = new VectorSource();
    const factoryStub = sinon.stub();
    const disposeStub = sinon.stub();
    factoryStub.returns({ dispose: disposeStub, interactions: [new Snap({ source: new VectorSource() })] });

    const tool = new PointTool(store, history, factoryStub);
    tool.setup(map, source);
    tool.dispose();

    expect(TestHelper.interactionNames(map)).toEqual([]);
    expect(disposeStub.callCount).toEqual(1);
  });
});
