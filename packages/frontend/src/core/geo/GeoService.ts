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

import { AbcLayer, AbcProjectManifest, WmsAuthentication } from '@abc-map/shared';
import { Logger } from '@abc-map/shared';
import { MapWrapper } from './map/MapWrapper';
import { MapFactory } from './map/MapFactory';
import { AbstractTool } from '../tools/AbstractTool';
import { mainStore } from '../store/store';
import { MapActions } from '../store/map/actions';
import { AxiosInstance } from 'axios';
import { WMSCapabilities as WMSCapabilitiesParser } from 'ol/format';
import { WmsCapabilities } from './WmsCapabilities';
import { FeatureStyle } from './style/FeatureStyle';
import { UpdateStyleItem, UpdateStyleTask } from '../history/tasks/features/UpdateStyleTask';
import { HistoryKey } from '../history/HistoryKey';
import { HistoryService } from '../history/HistoryService';
import { LayerFactory } from './layers/LayerFactory';
import { NominatimResult } from './NominatimResult';
import { FeatureWrapper } from './features/FeatureWrapper';

export const logger = Logger.get('GeoService.ts');

export class GeoService {
  private mainMap = MapFactory.createDefault();

  constructor(private httpClient: AxiosInstance, private history: HistoryService) {}

  public getMainMap(): MapWrapper {
    return this.mainMap;
  }

  public async exportLayers(map: MapWrapper): Promise<AbcLayer[]> {
    const result: AbcLayer[] = [];
    const layers = map.getLayers();
    for (const layer of layers) {
      const lay = await layer.toAbcLayer();
      result.push(lay);
    }
    return result;
  }

  public async importProject(map: MapWrapper, project: AbcProjectManifest): Promise<void> {
    map.unwrap().getLayers().clear();
    for (const abcLayer of project.layers) {
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

    return this.httpClient.get(capabilitiesUrl, { auth }).then((res) => {
      return parser.read(res.data);
    });
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
      .then((res) => res.data);
  }
}
