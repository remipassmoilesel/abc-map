import { Point } from 'ol/geom';
import { ModifyGeometriesTask } from './ModifyGeometriesTask';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';

describe('ModifyGeometryTask', function () {
  it('geometries should be cloned', function () {
    const feature = FeatureWrapper.create();
    const before = new Point([16, 48]);
    const after = new Point([12, 12]);
    const item = {
      feature,
      before,
      after,
    };
    const task = new ModifyGeometriesTask([item]);

    task.undo();
    expect(feature.getGeometry()).toBeInstanceOf(Point);
    expect((feature.getGeometry() as Point).getCoordinates()).toEqual([16, 48]);
    expect(feature.getGeometry() === before).toBeFalsy();

    task.redo();
    expect(feature.getGeometry()).toBeInstanceOf(Point);
    expect((feature.getGeometry() as Point).getCoordinates()).toEqual([12, 12]);
    expect(feature.getGeometry() === after).toBeFalsy();
  });
});
