import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';
import { UpdateStyleTask } from './UpdateStyleTask';
import { TestHelper } from '../../utils/TestHelper';
import { VectorStyles } from '../../geo/style/VectorStyles';

describe('UpdateStyleTask', function () {
  it('should set style on undo', function () {
    const feature = new Feature<Geometry>();
    const before = TestHelper.sampleStyleProperties();
    before.stroke.width = 10;
    const after = TestHelper.sampleStyleProperties();
    after.stroke.width = 20;
    const task = new UpdateStyleTask([{ feature, before, after }]);

    task.undo();
    expect(VectorStyles.getProperties(feature).stroke.width).toEqual(10);

    task.redo();
    expect(VectorStyles.getProperties(feature).stroke.width).toEqual(20);
  });
});
