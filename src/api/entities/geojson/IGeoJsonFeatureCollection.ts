import * as geojson from 'geojson';
import {IGeoJsonGeometry} from "./IGeoJsonGeometry";

export interface IGeoJsonFeatureCollection extends geojson.FeatureCollection<IGeoJsonGeometry, any> {

}