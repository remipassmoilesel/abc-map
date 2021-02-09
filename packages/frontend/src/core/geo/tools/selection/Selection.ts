import { AbstractTool } from '../AbstractTool';
import { MapTool } from '@abc-map/shared-entities';
import { DragBox, Translate } from 'ol/interaction';
import { onlyMainButton } from '../common/common-conditions';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Collection, Map } from 'ol';
import { FeatureHelper } from '../../features/FeatureHelper';
import Icon from '../../../../assets/tool-icons/selection.svg';
import { containsXY, Extent } from 'ol/extent';
import Feature from 'ol/Feature';
import { HistoryKey } from '../../../history/HistoryKey';
import { ModificationItem, ModifyGeometriesTask } from '../../../history/tasks/ModifyGeometriesTask';
import { Logger } from '../../../utils/Logger';

const logger = Logger.get('Selection.ts');

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
      className: 'abc-selection-box',
    });

    const features = new Collection<Feature<Geometry>>();

    dragBox.on('boxstart', () => {
      features.clear();
      // Warning: this can become a performance issue
      source.forEachFeature((feature) => {
        FeatureHelper.setSelected(feature, false);
      });
    });

    dragBox.on('boxend', () => {
      const selection = dragBox.getGeometry().getExtent();
      source.forEachFeatureInExtent(selection, (feature) => {
        const geomExtent = feature.getGeometry()?.getExtent();
        if (isWithinExtent(selection, geomExtent)) {
          FeatureHelper.setSelected(feature, true);
          features.push(feature);
        }
      });
    });

    const translate = new Translate({
      features,
    });

    let translated: Feature<Geometry>[] = [];
    translate.on('translatestart', () => {
      features.forEach((feature) => {
        if (FeatureHelper.isSelected(feature)) {
          const clone = FeatureHelper.clone(feature);
          translated.push(clone);
        }
      });
    });

    translate.on('translateend', () => {
      const items = features
        .getArray()
        .map((feature) => {
          if (!feature.getId()) {
            logger.error('Cannot register modify task, feature does not have an id');
            return null;
          }

          const before = translated.find((f) => f.getId() === feature.getId());
          const geomBefore = before?.getGeometry();
          const geomAfter = feature?.getGeometry()?.clone(); // As geometries are mutated, here we must clone it
          if (!geomBefore || !geomAfter) {
            logger.error(`Cannot register modify task, 'before' feature not found with id ${feature.getId()}`);
            return null;
          }

          return { feature, before: geomBefore, after: geomAfter };
        })
        .filter((item) => !!item) as ModificationItem[];

      this.history.register(HistoryKey.Map, new ModifyGeometriesTask(items));
      translated = [];
    });

    map.addInteraction(dragBox);
    map.addInteraction(translate);
    this.interactions.push(dragBox);
    this.interactions.push(translate);
  }
}

function isWithinExtent(selection: Extent, geomExtent?: Extent) {
  return geomExtent && containsXY(selection, geomExtent[0], geomExtent[1]) && containsXY(selection, geomExtent[2], geomExtent[3]);
}
