import { AbstractTool } from '../AbstractTool';
import { Logger, MapTool } from '@abc-map/frontend-commons';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Icon from '../../../../assets/tool-icons/point.svg';
import { Map } from 'ol';
import { HistoryKey } from '../../../history/HistoryKey';
import { defaultInteractions } from '../../map/interactions';
import { DrawInteraction, drawInteractionFactory, GetStyleFunc, HistoryTaskHandler } from '../common/drawInteractionFactory';
import GeometryType from 'ol/geom/GeometryType';
import { MainStore } from '../../../store/store';
import { HistoryService } from '../../../history/HistoryService';

const logger = Logger.get('PointTool.tsx');

export class PointTool extends AbstractTool {
  private drawInteractions?: DrawInteraction;

  constructor(store: MainStore, history: HistoryService, private interactionFactory = drawInteractionFactory) {
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

  protected setupInternal(map: Map, source: VectorSource<Geometry>): void {
    // Interactions for map view manipulation
    const defaults = defaultInteractions();
    defaults.forEach((i) => map.addInteraction(i));
    this.interactions.push(...defaults);

    // Tool interactions
    const getStyle: GetStyleFunc = () => {
      const style = this.store.getState().map.currentStyle;
      return { point: style.point };
    };

    const handleTask: HistoryTaskHandler = (t) => {
      this.history.register(HistoryKey.Map, t);
    };

    this.drawInteractions = this.interactionFactory(GeometryType.POINT, source, getStyle, handleTask);
    this.drawInteractions.interactions.forEach((i) => map.addInteraction(i));
    this.interactions.push(...this.drawInteractions.interactions);
  }

  protected disposeInternal() {
    this.drawInteractions?.dispose();
  }
}
