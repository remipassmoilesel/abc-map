import { MainStore } from '../../../store/store';
import { HistoryService } from '../../../history/HistoryService';
import { Map } from 'ol';
import VectorSource from 'ol/source/Vector';
import { PointTool } from './PointTool';
import sinon, { SinonStub, SinonStubbedInstance } from 'sinon';
import { PointInteraction } from './PointInteraction';
import { FeatureBeingCreated, FeatureCreated, GeometryBeingUpdated, GeometryUpdated } from '../common/ToolEvent';
import { FeatureWrapper } from '../../features/FeatureWrapper';
import { HistoryKey } from '../../../history/HistoryKey';
import { AddFeaturesTask } from '../../../history/tasks/features/AddFeaturesTask';
import Point from 'ol/geom/Point';
import { UpdateGeometriesTask } from '../../../history/tasks/features/UpdateGeometriesTask';

describe('Point', () => {
  let map: SinonStubbedInstance<Map>;
  let source: SinonStubbedInstance<VectorSource>;
  let getState: SinonStub;
  let history: SinonStubbedInstance<HistoryService>;
  let interaction: PointInteraction;
  let tool: PointTool;

  beforeEach(() => {
    map = sinon.createStubInstance(Map);
    source = sinon.createStubInstance(VectorSource);

    getState = sinon.stub();
    const store = ({ getState } as unknown) as MainStore;
    history = sinon.createStubInstance(HistoryService);
    interaction = new PointInteraction({ map: (map as unknown) as Map, source: (source as unknown) as VectorSource });
    const factory = () => interaction;

    tool = new PointTool(store, (history as unknown) as HistoryService, factory);
    tool.setup((map as unknown) as Map, (source as unknown) as VectorSource);
  });

  it('should set selected, id and style on feature creating', () => {
    const feature = FeatureWrapper.create();
    getState.returns({ map: { currentStyle: { point: { icon: 'test-icon', size: 99 } } } });

    interaction.dispatchEvent(new FeatureBeingCreated(feature.unwrap()));

    expect(feature.isSelected()).toEqual(true);
    expect(feature.getId()).toBeDefined();
    expect(feature.getStyleProperties().point?.icon).toEqual('test-icon');
    expect(feature.getStyleProperties().point?.size).toEqual(99);
  });

  it('should register history task on feature created', () => {
    const feature = FeatureWrapper.create();

    interaction.dispatchEvent(new FeatureCreated(feature.unwrap()));

    expect(history.register.callCount).toEqual(1);
    expect(history.register.args[0][0]).toEqual(HistoryKey.Map);
    expect(history.register.args[0][1]).toEqual(new AddFeaturesTask((source as unknown) as VectorSource, [feature]));
  });

  it('should register task on feature modified', () => {
    const feature = FeatureWrapper.create(new Point([1, 1]));

    interaction.dispatchEvent(new GeometryBeingUpdated(feature.unwrap()));
    feature.unwrap().setGeometry(new Point([2, 2]));
    interaction.dispatchEvent(new GeometryUpdated(feature.unwrap()));

    expect(history.register.callCount).toEqual(1);
    expect(history.register.args[0][0]).toEqual(HistoryKey.Map);
    const task = history.register.args[0][1] as UpdateGeometriesTask;
    expect(task).toBeInstanceOf(UpdateGeometriesTask);
    expect(task.items).toHaveLength(1);
    expect(task.items[0].feature.getId()).toEqual(feature.getId());
    expect((task.items[0].before as Point).getCoordinates()).toEqual([1, 1]);
    expect((task.items[0].after as Point).getCoordinates()).toEqual([2, 2]);
  });

  it('dispose()', () => {
    tool.dispose();

    expect(map.removeInteraction.callCount).toBeGreaterThan(1);
    expect(map.removeInteraction.args.map((f) => f[0].constructor.name)).toContain('PointInteraction');
  });
});
