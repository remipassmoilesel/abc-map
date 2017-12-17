import * as path from 'path';
import {INominatimResult} from "../geocoder/NominatimGeocoder";

const dataDir = path.resolve(__dirname, '../../../src/resources/example-data');

export class TestData {
    public static SAMPLE_GPX = path.resolve(dataDir, 'sample.gpx');
    public static SAMPLE_KML = path.resolve(dataDir, 'sample.kml');
    public static SAMPLE_GEOJSON = path.resolve(dataDir, 'sample.json');

    public static GPX_LYON_PARIS = path.resolve(dataDir, 'lyon-paris.gpx');
    public static JSON_LYON_PARIS = path.resolve(dataDir, 'lyon-paris.json');

    public static KML_GRENOBLE_SHAPES = path.resolve(dataDir, 'grenoble-shapes.kml');
    public static KML_GRENOBLE_SHAPES_FILTER1 = path.resolve(dataDir, 'grenoble-shapes-filter1.kml');
    public static JSON_GRENOBLE_SHAPES = path.resolve(dataDir, 'grenoble-shapes.json');
    public static JSON_GRENOBLE_SHAPES_FILTER1 = path.resolve(dataDir, 'grenoble-shapes-filter1.json');

    public static NOMINATIM_RESULT: INominatimResult = {
        "place_id": "179360921",
        "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright",
        "osm_type": "relation",
        "osm_id": "28960",
        "boundingbox": ["43.5316216", "43.6106343", "3.6567219", "3.7577421"],
        "lat": "43.557935",
        "lon": "3.7188857",
        "display_name": "Cournonterral, Montpellier, Hérault, Occitanie, France métropolitaine, 34660, France",
        "class": "boundary",
        "type": "administrative",
        "importance": 0.23192357769809,
        "icon": "http:\/\/nominatim.openstreetmap.org\/images\/mapicons\/poi_boundary_administrative.p.20.png"
    };
}