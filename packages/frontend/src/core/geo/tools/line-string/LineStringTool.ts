import { AbstractTool } from '../AbstractTool';
import { MapTool } from '@abc-map/frontend-commons';
import GeometryType from 'ol/geom/GeometryType';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import Icon from '../../../../assets/tool-icons/line.svg';
import { Map } from 'ol';
import { defaultInteractions } from '../../map/interactions';
import { DrawInteraction, drawInteractionFactory, GetStyleFunc, HistoryTaskHandler } from '../common/drawInteractionFactory';
import { HistoryKey } from '../../../history/HistoryKey';
import { MainStore } from '../../../store/store';
import { HistoryService } from '../../../history/HistoryService';

export class LineStringTool extends AbstractTool {
  private drawInteractions?: DrawInteraction;
  constructor(store: MainStore, history: HistoryService, private interactionFactory = drawInteractionFactory) {
    super(store, history);
  }

  public getId(): MapTool {
    return MapTool.LineString;
  }

  public getIcon(): string {
    return Icon;
  }

  public getLabel(): string {
    return 'Lignes';
  }

  protected setupInternal(map: Map, source: VectorSource<Geometry>): void {
    // Interactions for map view manipulation
    const defaults = defaultInteractions();
    defaults.forEach((i) => map.addInteraction(i));
    this.interactions.push(...defaults);

    // Tool interactions
    const getStyle: GetStyleFunc = () => {
      const style = this.store.getState().map.currentStyle;
      return { stroke: style.stroke };
    };

    const handleTask: HistoryTaskHandler = (t) => {
      this.history.register(HistoryKey.Map, t);
    };

    this.drawInteractions = this.interactionFactory(GeometryType.LINE_STRING, source, getStyle, handleTask);
    this.drawInteractions.interactions.forEach((i) => map.addInteraction(i));
    this.interactions.push(...this.drawInteractions.interactions);
  }

  protected disposeInternal() {
    this.drawInteractions?.dispose();
  }
}
