import { MapWrapper } from '../../../core/geo/map/MapWrapper';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { ScriptLayer } from './ScriptLayer';

export class ScriptMap {
  constructor(private map: MapWrapper) {}

  public listLayers(): ScriptLayer[] {
    return this.map.getLayers().map((lay) => ({ id: lay.getId() || '<no-id>', name: lay.getName() || '<no-name>' }));
  }

  public getFeaturesOfLayer(name: string): Feature<Geometry>[] {
    const layer = this.map.getLayers().find((lay) => lay.getName() === name);
    if (!layer) {
      throw new Error(`Layer name not found: ${name}`);
    }

    if (!layer.isVector()) {
      throw new Error(`Layer with name ${name} is not a vector layer`);
    }

    return layer.getSource().getFeatures();
  }

  public getFeaturesOfLayerById(id: string): Feature<Geometry>[] {
    const layer = this.map.getLayers().find((lay) => lay.getId() === id);
    if (!layer) {
      throw new Error(`Layer id not found: ${id}`);
    }

    if (!layer.isVector()) {
      throw new Error(`Layer with id ${id} is not a vector layer`);
    }

    return layer.getSource().getFeatures();
  }
}
