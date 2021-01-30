import { AbstractTool } from './AbstractTool';
import { MapTool } from '@abc-map/shared-entities';
import { DragBox } from 'ol/interaction';
import { onlyMainButton } from './common-conditions';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Map } from 'ol';
import { FeatureHelper } from '../features/FeatureHelper';
import Icon from '../../../assets/tool-icons/selection.svg';

export class Selection extends AbstractTool {
  public getId(): MapTool {
    return MapTool.Selection;
  }

  public getIcon(): string {
    return Icon;
  }

  public getLabel(): string {
    return 'Sélection';
  }

  public setup(map: Map, source: VectorSource<Geometry>): void {
    super.setup(map, source);

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

    map.addInteraction(dragBox);
    this.interactions.push(dragBox);
  }
}
