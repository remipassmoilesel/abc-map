/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { AbcLayer, WmsAuthentication } from '@abc-map/shared';
import { Logger } from '@abc-map/shared';
import { MapWrapper } from './map/MapWrapper';
import { MapFactory } from './map/MapFactory';
import { AbstractTool } from '../tools/AbstractTool';
import { MainStore, mainStore } from '../store/store';
import { MapActions } from '../store/map/actions';
import { AxiosInstance } from 'axios';
import { WMSCapabilities as WMSCapabilitiesParser } from 'ol/format';
import { WmsCapabilities } from './WmsCapabilities';
import { FeatureStyle } from '@abc-map/shared';
import { UpdateStyleItem, UpdateStyleTask } from '../history/tasks/features/UpdateStyleTask';
import { HistoryKey } from '../history/HistoryKey';
import { HistoryService } from '../history/HistoryService';
import { NominatimResult } from './NominatimResult';
import { FeatureWrapper } from './features/FeatureWrapper';
import { ToastService } from '../ui/ToastService';
import { LayerFactory } from './layers/LayerFactory';
import { ProjectActions } from '../store/project/actions';
import { Coordinate } from 'ol/coordinate';

export const logger = Logger.get('GeoService.ts');

export class GeoService {
  private mainMap = MapFactory.createDefault();

  constructor(private httpClient: AxiosInstance, private toasts: ToastService, private history: HistoryService, private store: MainStore) {
    this.listenViewChanges();
  }

  public getMainMap(): MapWrapper {
    return this.mainMap;
  }

  public getUserPosition(): Promise<Coordinate> {
    return new Promise<Coordinate>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve([pos.coords.longitude, pos.coords.latitude]),
        (err) => reject(err)
      );
    });
  }

  public async exportLayers(): Promise<AbcLayer[]> {
    const layers = this.getMainMap().getLayers();
    const result: AbcLayer[] = [];

    for (const layer of layers) {
      const lay = await layer.toAbcLayer();
      result.push(lay);
    }
    return result;
  }

  public async importLayers(layers: AbcLayer[]): Promise<void> {
    const map = this.getMainMap();
    map.unwrap().getLayers().clear();

    for (const abcLayer of layers) {
      const layer = await LayerFactory.fromAbcLayer(abcLayer);
      map.addLayer(layer);
    }
  }

  public setMainTool(tool: AbstractTool): void {
    this.getMainMap().setTool(tool);
    mainStore.dispatch(MapActions.setTool(tool.getId()));
  }

  /**
   * Warning: responses can be VERY heavy
   */
  public getWmsCapabilities(url: string, auth?: WmsAuthentication): Promise<WmsCapabilities> {
    const capabilitiesUrl = `${url}?service=wms&request=GetCapabilities`;
    const parser = new WMSCapabilitiesParser();

    return this.httpClient.get(capabilitiesUrl, { auth }).then((res) => parser.read(res.data));
  }

  public updateSelectedFeatures(transform: (x: FeatureStyle, f: FeatureWrapper) => FeatureStyle) {
    const historyItems: UpdateStyleItem[] = [];
    this.getMainMap().forEachFeatureSelected((feat) => {
      const newStyle = transform(feat.getStyleProperties(), feat);

      historyItems.push({
        feature: feat,
        before: feat.getStyleProperties(),
        after: newStyle,
      });

      feat.setStyleProperties(newStyle);
    });

    if (historyItems.length) {
      this.history.register(HistoryKey.Map, new UpdateStyleTask(historyItems));
    }
  }

  public async geocode(query: string): Promise<NominatimResult[]> {
    const url = 'https://nominatim.openstreetmap.org/search';
    return this.httpClient
      .get(url, {
        params: {
          q: query,
          format: 'json',
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        this.toasts.httpError(err);
        return Promise.reject(err);
      });
  }

  private listenViewChanges() {
    this.mainMap.unwrap().on('moveend', () => {
      const view = this.mainMap.getView();
      this.store.dispatch(ProjectActions.viewChanged(view));
    });
  }
}
