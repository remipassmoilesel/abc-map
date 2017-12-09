import * as geojson from 'geojson';
import {IGeoJsonGeometry} from "./IGeoJsonGeometry";

export interface IFeatureCollection extends geojson.FeatureCollection<IGeoJsonGeometry, any> {

}