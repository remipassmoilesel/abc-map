import { UpdateStyleTask } from './UpdateStyleTask';
import { TestHelper } from '../../../utils/TestHelper';
import { FeatureWrapper } from '../../../geo/features/FeatureWrapper';
import { FeatureStyle } from '../../../geo/style/FeatureStyle';

describe('UpdateStyleTask', function () {
  let feature: FeatureWrapper;
  let before: FeatureStyle;
  let after: FeatureStyle;
  let task: UpdateStyleTask;

  beforeEach(() => {
    feature = FeatureWrapper.create();
    before = TestHelper.sampleStyleProperties();
    before.stroke = {
      ...before.stroke,
      width: 10,
    };

    after = TestHelper.sampleStyleProperties();
    after.stroke = {
      ...before.stroke,
      width: 20,
    };

    task = new UpdateStyleTask([{ feature, before, after }]);
  });

  it('should undo', function () {
    task.undo();
    expect(feature.getStyleProperties().stroke?.width).toEqual(10);
  });

  it('should redo', function () {
    task.redo();
    expect(feature.getStyleProperties().stroke?.width).toEqual(20);
  });
});
