import { Geometry, Point } from 'ol/geom';
import Feature from 'ol/Feature';
import { ModifyGeometriesTask } from './ModifyGeometriesTask';

describe('ModifyGeometryTask', function () {
  it('geometries should be cloned', function () {
    const feature = new Feature<Geometry>();
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
