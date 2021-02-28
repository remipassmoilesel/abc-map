import { MapWrapper } from '../../geo/map/MapWrapper';
import { MapFactory } from '../../geo/map/MapFactory';
import { AddLayersTask } from './AddLayersTask';
import { LayerFactory } from '../../geo/layers/LayerFactory';

describe('AddLayersTask', () => {
  let map: MapWrapper;

  beforeEach(() => {
    map = MapFactory.createNaked();
  });

  it('undo()', () => {
    const layer1 = LayerFactory.newVectorLayer();
    const layer2 = LayerFactory.newVectorLayer();
    map.addLayer(layer1);
    map.addLayer(layer2);

    const task = new AddLayersTask(map, [layer1, layer2]);
    task.undo();

    expect(map.getLayers()).toHaveLength(0);
  });

  it('redo()', () => {
    const layer1 = LayerFactory.newVectorLayer();
    const layer2 = LayerFactory.newVectorLayer();

    const task = new AddLayersTask(map, [layer1, layer2]);
    task.redo();

    expect(map.getLayers()).toHaveLength(2);
    expect(map.getLayers()[1].isActive()).toEqual(true);
  });
});
