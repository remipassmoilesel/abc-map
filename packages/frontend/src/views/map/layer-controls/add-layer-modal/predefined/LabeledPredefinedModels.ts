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
import { PredefinedLayerModel } from '@abc-map/shared';
import OsmPreview from './previews/osm.jpg';
import StamenTonerPreview from './previews/stamen-toner.jpg';
import StamenTonerLitePreview from './previews/stamen-toner-lite.jpg';
import StamenTerrainPreview from './previews/stamen-terrain.jpg';
import StamenWaterColorPreview from './previews/stamen-watercolor.jpg';

export interface LabeledPredefinedModel {
  id: PredefinedLayerModel;
  label: string;
  preview: string;
  by: string;
  license: string;
}

const byOsm = '<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors';
const osmLicense = '<a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA 2.0</a>';
const byStamen = '<a href="https://stamen.com/" target="_blank">Stamen Design</a>';
const stamenLicense = '<a href="https://creativecommons.org/licenses/by/3.0/" target="_blank">CC BY 3.0</a>';

export class LabeledPredefinedModels {
  public static readonly Osm: LabeledPredefinedModel = {
    id: PredefinedLayerModel.OSM,
    label: 'OpenStreetMap',
    preview: OsmPreview,
    by: byOsm,
    license: osmLicense,
  };

  public static readonly StamenToner: LabeledPredefinedModel = {
    id: PredefinedLayerModel.StamenToner,
    label: 'Stamen Toner',
    preview: StamenTonerPreview,
    by: byStamen,
    license: stamenLicense,
  };

  public static readonly StamenTonerLite: LabeledPredefinedModel = {
    id: PredefinedLayerModel.StamenTonerLite,
    label: 'Stamen Toner Lite',
    preview: StamenTonerLitePreview,
    by: byStamen,
    license: stamenLicense,
  };

  public static readonly StamenTerrain: LabeledPredefinedModel = {
    id: PredefinedLayerModel.StamenTerrain,
    label: 'Stamen Terrain',
    preview: StamenTerrainPreview,
    by: byStamen,
    license: stamenLicense,
  };

  public static readonly StamenWatercolor: LabeledPredefinedModel = {
    id: PredefinedLayerModel.StamenWatercolor,
    label: 'Stamen Watercolor',
    preview: StamenWaterColorPreview,
    by: byStamen,
    license: stamenLicense,
  };

  public static readonly All: LabeledPredefinedModel[] = [
    LabeledPredefinedModels.Osm,
    LabeledPredefinedModels.StamenToner,
    LabeledPredefinedModels.StamenTonerLite,
    LabeledPredefinedModels.StamenTerrain,
    LabeledPredefinedModels.StamenWatercolor,
  ];

  public static find(model: PredefinedLayerModel): LabeledPredefinedModel | undefined {
    return LabeledPredefinedModels.All.find((type) => type.id === model);
  }
}
