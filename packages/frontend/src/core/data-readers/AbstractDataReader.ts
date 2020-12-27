import { AbcProjection } from '@abc-map/shared-entities';
import BaseLayer from 'ol/layer/Base';
import { AbcFile } from './AbcFile';

export abstract class AbstractDataReader {
  public abstract isSupported(files: AbcFile[]): Promise<boolean>;
  public abstract read(files: AbcFile[], projection: AbcProjection): Promise<BaseLayer[]>;
}
