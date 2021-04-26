import { AbstractTool } from '../AbstractTool';
import { MapTool } from '@abc-map/frontend-commons';
import { DragBox, Translate } from 'ol/interaction';
import { onlyMainButton } from '../common/common-conditions';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Collection, Map } from 'ol';
import Icon from '../../../../assets/tool-icons/selection.svg';
import { containsXY, Extent } from 'ol/extent';
import Feature from 'ol/Feature';
import { HistoryKey } from '../../../history/HistoryKey';
import { UpdateItem, UpdateGeometriesTask } from '../../../history/tasks/features/UpdateGeometriesTask';
import { Logger } from '@abc-map/frontend-commons';
import { FeatureWrapper } from '../../features/FeatureWrapper';

const logger = Logger.get('SelectionTool.ts');

export class SelectionTool extends AbstractTool {
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

    const selection = new Collection<Feature<Geometry>>();

    const dragBox = new DragBox({
      condition: onlyMainButton,
      className: 'abc-selection-box',
    });

    const sourceListener = source.on('addfeature', (evt) => {
      if (FeatureWrapper.from(evt.feature).isSelected()) {
        selection.push(evt.feature);

        // If one feature were added, others can be deselected. So we remove them
        selection
          .getArray()
          .slice()
          .forEach((feat) => {
            if (!FeatureWrapper.from(feat).isSelected()) {
              selection.remove(feat);
            }
          });
      }
    });
    this.sourceListeners.push(sourceListener);

    dragBox.on('boxstart', () => {
      selection.clear();
      // WARNING: this can lead to poor performances
      source.forEachFeature((feat) => {
        const feature = FeatureWrapper.from(feat);
        if (feature.isSelected()) {
          feature.setSelected(false);
        }
      });
    });

    dragBox.on('boxend', () => {
      const extent = dragBox.getGeometry().getExtent();
      source.forEachFeatureInExtent(extent, (feature) => {
        const geomExtent = feature.getGeometry()?.getExtent();
        if (isWithinExtent(extent, geomExtent)) {
          FeatureWrapper.from(feature).setSelected(true);
          selection.push(feature);
        }
      });
    });

    const translate = new Translate({
      features: selection,
    });

    let translated: FeatureWrapper[] = [];
    translate.on('translatestart', () => {
      selection.forEach((feat) => {
        const clone = FeatureWrapper.from(feat).clone();
        translated.push(clone);
      });
    });

    translate.on('translateend', () => {
      const items = selection
        .getArray()
        .map((feat) => {
          const feature = FeatureWrapper.from(feat);
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
        .filter((item) => !!item) as UpdateItem[];

      this.history.register(HistoryKey.Map, new UpdateGeometriesTask(items));
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
