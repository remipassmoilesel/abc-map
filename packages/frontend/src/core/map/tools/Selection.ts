import { AbstractTool } from './AbstractTool';
import { MapTool } from '@abc-map/shared-entities';
import { DragBox, Interaction } from 'ol/interaction';
import { onlyMainButton } from './common-conditions';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { FeatureHelper } from '../FeatureHelper';

export class Selection extends AbstractTool {
  public getId(): MapTool {
    return MapTool.Selection;
  }

  public getIcon(): string {
    return 'SL';
  }

  public getLabel(): string {
    return 'Sélection';
  }

  public getMapInteractions(source: VectorSource<Geometry>): Interaction[] {
    const dragBox = new DragBox({
      condition: onlyMainButton,
    });

    dragBox.on('boxstart', () => {
      source.forEachFeature((feature) => {
        FeatureHelper.setSelected(feature, false);
      });
    });

    dragBox.on('boxend', () => {
      const extent = dragBox.getGeometry().getExtent();
      source.forEachFeatureIntersectingExtent(extent, (feature) => {
        FeatureHelper.setSelected(feature, true);
      });
    });

    return [dragBox];
  }
}
