import { Feature } from 'geojson';

export interface Project {
  id: string;
  name: string;
  layers: Layer[];
  createdAt: string;
}

export enum LayerType {
  VECTOR = 'VECTOR',
  TILE = 'TILE',
}

export interface Layer {
  id: string;
  name: string;
  opacity: number;
  visible: boolean;
  type: LayerType;
}

export interface VectorLayer {
  type: LayerType.VECTOR;
  features: Feature[];
}

export interface TileLayer {
  type: LayerType.TILE;
  sourceUrl?: string;
  authentication?: {
    username: string;
    password: string;
  };
}
