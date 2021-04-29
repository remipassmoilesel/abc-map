import { Interaction } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Map } from 'ol';
import { Logger, MapTool } from '@abc-map/frontend-commons';
import { MainStore } from '../../store/store';
import { HistoryService } from '../../history/HistoryService';
import { EventsKey } from 'ol/events';

const logger = Logger.get('AbstractTool.ts');

// TODO: test setup and teardown
export abstract class AbstractTool {
  protected mapListeners: EventsKey[] = [];
  protected sourceListeners: EventsKey[] = [];
  protected interactions: Interaction[] = [];
  protected vectorSource?: VectorSource;
  protected map?: Map;

  constructor(protected store: MainStore, protected history: HistoryService) {}

  public abstract getId(): MapTool;
  public abstract getLabel(): string;
  public abstract getIcon(): string;
  protected abstract setupInternal(map: Map, source: VectorSource<Geometry>): void;

  public setup(map: Map, source: VectorSource<Geometry>): void {
    this.map = map;
    this.vectorSource = source;
    this.setupInternal(map, source);
  }

  public dispose() {
    this.disposeInternal();

    this.mapListeners.forEach((l) => this.map?.un(l.type, l.listener));
    this.sourceListeners.forEach((l) => this.vectorSource?.un(l.type, l.listener));
    this.interactions.forEach((inter) => {
      this.map?.removeInteraction(inter);
      inter.dispose();
    });

    this.mapListeners = [];
    this.sourceListeners = [];
    this.interactions = [];
    this.vectorSource = undefined;
    this.map = undefined;
  }

  protected disposeInternal(): void {
    return;
  }

  public getMap(): Map | undefined {
    return this.map;
  }

  public getSource(): VectorSource | undefined {
    return this.vectorSource;
  }

  public getInteractions(): Interaction[] {
    return this.interactions;
  }

  public getMapListeners(): EventsKey[] {
    return this.mapListeners;
  }
}
