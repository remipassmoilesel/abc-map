import { DataSource } from '../../core/data/data-source/DataSource';
import { VectorLayerWrapper } from '../../core/geo/layers/LayerWrapper';

export interface Parameters {
  newLayerName?: string;
  data: {
    source?: DataSource;
    sizeField?: string;
    joinBy?: string;
  };
  geometries: {
    layer?: VectorLayerWrapper;
    joinBy?: string;
  };
  points: {
    type?: PointType;
    sizeMin?: number;
    sizeMax?: number;
    algorithm?: ScaleAlgorithm;
  };
}

export enum PointType {
  Circle = 'Circle',
}

export enum ScaleAlgorithm {
  Absolute = 'Absolute',
  Interpolated = 'Interpolated',
}

export function newParameters(): Parameters {
  return {
    newLayerName: 'Symboles',
    data: {},
    geometries: {},
    points: {
      type: PointType.Circle,
      sizeMin: 1,
      sizeMax: 20,
      algorithm: ScaleAlgorithm.Absolute,
    },
  };
}
