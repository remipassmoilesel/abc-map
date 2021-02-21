/**
 * Nominatim API result.
 *
 * Here lot of numbers are returned as strings.
 */
export interface NominatimResult {
  boundingbox: [string, string, string, string];
  class: string;
  display_name: string;
  icon: string;
  importance: 0.8783421083469705;
  lat: string;
  lon: string;
  licence: string;
  osm_id: number;
  osm_type: string;
  place_id: number;
  type: string;
}
