import { AbcProjection } from '../project';

export interface WmsDefinition {
  url: string;
  layerName: string;
  projection?: AbcProjection;
  extent?: [number, number, number, number];
  auth?: WmsAuthentication;
}

export interface WmsAuthentication {
  username: string;
  password: string;
}
