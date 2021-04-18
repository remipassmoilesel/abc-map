import { Point } from 'ol/geom';
import { UpdateGeometriesTask } from './UpdateGeometriesTask';
import { FeatureWrapper } from '../../../geo/features/FeatureWrapper';

describe('UpdateGeometryTask', function () {
  let feature: FeatureWrapper;
  let before: Point;
  let after: Point;
  let task: UpdateGeometriesTask;

  beforeEach(() => {
    feature = FeatureWrapper.create();
    before = new Point([16, 48]);
    after = new Point([12, 12]);
    const item = {
      feature,
      before,
      after,
    };
    task = new UpdateGeometriesTask([item]);
  });

  it('should undo', function () {
    task.undo();
    expect(feature.getGeometry()).toBeInstanceOf(Point);
    expect((feature.getGeometry() as Point).getCoordinates()).toEqual([16, 48]);
    expect(feature.getGeometry() === before).toBeFalsy();
  });

  it('should redo', function () {
    task.redo();
    expect(feature.getGeometry()).toBeInstanceOf(Point);
    expect((feature.getGeometry() as Point).getCoordinates()).toEqual([12, 12]);
    expect(feature.getGeometry() === after).toBeFalsy();
  });
});
