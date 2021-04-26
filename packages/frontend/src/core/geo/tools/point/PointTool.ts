import { AbstractTool } from '../AbstractTool';
import { Logger, MapTool } from '@abc-map/frontend-commons';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Icon from '../../../../assets/tool-icons/point.svg';
import { Map } from 'ol';
import { PointInteraction } from './PointInteraction';
import { FeatureWrapper } from '../../features/FeatureWrapper';
import { HistoryKey } from '../../../history/HistoryKey';
import { AddFeaturesTask } from '../../../history/tasks/features/AddFeaturesTask';
import { GeometryBeingUpdated, FeatureCreated, ToolEvent, GeometryUpdated } from '../common/ToolEvent';
import { UpdateGeometriesTask } from '../../../history/tasks/features/UpdateGeometriesTask';
import { unselectAll } from '../common/selection-helpers';
import { MainStore } from '../../../store/store';
import { HistoryService } from '../../../history/HistoryService';

const logger = Logger.get('PointTool.tsx');

function interactionFactory(map: Map, source: VectorSource): PointInteraction {
  return new PointInteraction({ map, source });
}

export class PointTool extends AbstractTool {
  constructor(store: MainStore, history: HistoryService, private newInteraction = interactionFactory) {
    super(store, history);
  }
  public getId(): MapTool {
    return MapTool.Point;
  }

  public getIcon(): string {
    return Icon;
  }

  public getLabel(): string {
    return 'Point';
  }

  public setup(map: Map, source: VectorSource<Geometry>): void {
    super.setup(map, source);

    const points = this.newInteraction(map, source);

    points.on(ToolEvent.FeatureBeingCreated, (ev: FeatureCreated) => {
      unselectAll(source);
      const feature = FeatureWrapper.from(ev.feature);
      feature.setId();

      const currentStyle = this.store.getState().map.currentStyle;
      feature.setStyleProperties({ point: currentStyle.point, fill: currentStyle.fill });
      feature.setSelected(true);
    });

    points.on(ToolEvent.FeatureCreated, (ev: FeatureCreated) => {
      const feature = FeatureWrapper.from(ev.feature);
      this.history.register(HistoryKey.Map, new AddFeaturesTask(source, [feature]));
    });

    let beforeUpdate: FeatureWrapper | undefined;
    points.on(ToolEvent.GeometryBeingUpdated, (ev: GeometryBeingUpdated) => {
      unselectAll(source);
      const feature = FeatureWrapper.from(ev.feature);
      feature.setSelected(true);

      beforeUpdate = feature.clone(); // As features are mutated, we must clone it
    });

    points.on(ToolEvent.GeometryUpdated, (ev: GeometryUpdated) => {
      const before = beforeUpdate?.getGeometry();
      const after = ev.feature.getGeometry()?.clone();
      if (!before || !after) {
        logger.error('Cannot register history task', { before, after });
        return;
      }

      this.history.register(
        HistoryKey.Map,
        new UpdateGeometriesTask([
          {
            before,
            after,
            feature: FeatureWrapper.from(ev.feature),
          },
        ])
      );
    });

    map.addInteraction(points);
    this.interactions.push(points);
  }
}
