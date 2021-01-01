import { Draw, Interaction, Modify, Snap } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { MapTool } from '@abc-map/shared-entities';
import { MainStore } from '../../store/store';
import { HistoryService } from '../../history/HistoryService';
import { DrawEvent } from 'ol/interaction/Draw';
import { VectorStyles } from '../VectorStyles';
import { HistoryKey } from '../../history/HistoryKey';
import { AddFeatureTask } from '../../history/AddFeatureTask';
import { onlyMainButton } from './common-conditions';

// TODO: Inject store and history service only ?
// TODO: or add properties on interactions ? In order to select interactions to remove
// TODO: or keep tool reference in geoservice, set tool in geoservice, refactor this method to setup() and add dispose() ?

export abstract class AbstractTool {
  constructor(protected store: MainStore, protected history: HistoryService) {}

  public abstract getId(): MapTool;
  public abstract getLabel(): string;
  public abstract getIcon(): string;

  public abstract getMapInteractions(source: VectorSource<Geometry>): Interaction[];

  /**
   * Setup a listener on tool to apply current style after draw
   * @param draw
   */
  protected applyStyleAfterDraw(draw: Draw): void {
    draw.on('drawend', (ev: DrawEvent) => {
      const feature = ev.feature;
      VectorStyles.setProperties(feature, this.store.getState().map.currentStyle);
    });
  }

  protected registerTaskOnDraw(draw: Draw, source: VectorSource): void {
    draw.on('drawend', (ev: DrawEvent) => {
      const feature = ev.feature;
      this.history.register(HistoryKey.Map, new AddFeatureTask(source, feature));
    });
  }

  // TODO: implement
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected registerTaskOnModify(draw: Draw, source: VectorSource): void {
    throw new Error('Not implemented');
  }

  // FIXME: TODO: Modify cause a performance issue if we pass too many features
  // FIXME: TODO: Here we should pass only features that are next to mouse, using throttled function
  // TODO: create modify feature task for history
  protected commonModifyInteractions(source: VectorSource): Interaction[] {
    const modify = new Modify({ source, condition: onlyMainButton });
    const snap = new Snap({ source });
    return [modify, snap];
  }
}
