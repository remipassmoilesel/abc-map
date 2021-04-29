import { AbstractTool } from '../AbstractTool';
import { Logger, MapTool } from '@abc-map/frontend-commons';
import GeometryType from 'ol/geom/GeometryType';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Map } from 'ol';
import Icon from '../../../../assets/tool-icons/polygon.svg';
import { DrawInteraction, drawInteractionFactory, GetStyleFunc, HistoryTaskHandler } from '../common/drawInteractionFactory';
import { HistoryKey } from '../../../history/HistoryKey';
import { defaultInteractions } from '../../map/interactions';
import { HistoryService } from '../../../history/HistoryService';
import { MainStore } from '../../../store/store';

const logger = Logger.get('PolygonTool.ts');

export class PolygonTool extends AbstractTool {
  private drawInteractions?: DrawInteraction;

  constructor(store: MainStore, history: HistoryService, private interactionFactory = drawInteractionFactory) {
    super(store, history);
  }

  public getId(): MapTool {
    return MapTool.Polygon;
  }

  public getIcon(): string {
    return Icon;
  }

  public getLabel(): string {
    return 'Polygones';
  }

  protected setupInternal(map: Map, source: VectorSource<Geometry>): void {
    // Interactions for map view manipulation
    const defaults = defaultInteractions();
    defaults.forEach((i) => map.addInteraction(i));
    this.interactions.push(...defaults);

    // Tool interactions
    const getStyle: GetStyleFunc = () => {
      const style = this.store.getState().map.currentStyle;
      return { fill: style.fill, stroke: style.stroke };
    };

    const handleTask: HistoryTaskHandler = (t) => {
      this.history.register(HistoryKey.Map, t);
    };

    this.drawInteractions = this.interactionFactory(GeometryType.POLYGON, source, getStyle, handleTask);
    this.drawInteractions.interactions.forEach((i) => map.addInteraction(i));
    this.interactions.push(...this.drawInteractions.interactions);
  }

  protected disposeInternal() {
    this.drawInteractions?.dispose();
  }
}
