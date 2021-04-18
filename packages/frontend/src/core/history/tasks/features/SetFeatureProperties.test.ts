import { FeatureWrapper, SimplePropertiesMap } from '../../../geo/features/FeatureWrapper';
import { SetFeatureProperties } from './SetFeatureProperties';

describe('SetFeatureProperties', function () {
  let feature: FeatureWrapper;
  let before: SimplePropertiesMap;
  let after: SimplePropertiesMap;
  let task: SetFeatureProperties;

  beforeEach(() => {
    feature = FeatureWrapper.create();
    before = { population: 12345 };
    after = { population: 56789 };
    task = new SetFeatureProperties(feature, before, after);
  });

  it('should undo', function () {
    task.undo();

    expect(feature.getSimpleProperties()).toEqual(before);
  });

  it('should redo', function () {
    task.redo();

    expect(feature.getSimpleProperties()).toEqual(after);
  });
});
