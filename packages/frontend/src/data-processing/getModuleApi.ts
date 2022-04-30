import { ModuleApi } from '@abc-map/module-api';
import { getServices } from '../core/Services';
import { FeatureWrapper } from '../core/geo/features/FeatureWrapper';
import { LayerFactory } from '../core/geo/layers/LayerFactory';
import { MapWrapper } from '../core/geo/map/MapWrapper';

/**
 * This API is used in external modules and in scripts
 */
export function getModuleApi(): ModuleApi {
  const { geo, history } = getServices();

  return {
    FeatureWrapperFactory: {
      from: FeatureWrapper.from,
      fromUnknown: FeatureWrapper.fromUnknown,
    },
    LayerFactory: LayerFactory,
    MapFactory: {
      from: MapWrapper.from,
      fromUnknown: MapWrapper.fromUnknown,
    },
    mainMap: geo.getMainMap(),
    services: {
      geo,
      history,
    },
    // This variable will be set at runtime
    resourceBaseUrl: '',
  };
}
