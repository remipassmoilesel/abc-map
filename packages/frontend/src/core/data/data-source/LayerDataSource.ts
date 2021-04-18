import { VectorLayerWrapper } from '../../../core/geo/layers/LayerWrapper';
import { DataRow, DataSource, DataSourceType } from './DataSource';
import { Logger } from '@abc-map/frontend-shared';
import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';
import { FeatureWrapper } from '../../geo/features/FeatureWrapper';

const logger = Logger.get('LayerDataSource.ts');

// FIXME: check if layer with numeric properties are always returned as numbers
export class LayerDataSource implements DataSource {
  constructor(private layer: VectorLayerWrapper) {
    if (!layer.getId()) {
      throw new Error('Layer id is mandatory');
    }
  }

  public getId(): string {
    return this.layer.getId() as string;
  }

  public getName(): string {
    return this.layer.getName() || 'Couche sans nom';
  }

  public getType(): DataSourceType {
    return DataSourceType.VectorLayer;
  }

  public async getRows(): Promise<DataRow[]> {
    const features = this.layer.getSource().getFeatures();
    const rows: DataRow[] = features.map((f) => this.featureToDataRow(f)).filter((r) => !!r) as DataRow[];

    if (features.length !== rows.length) {
      return Promise.reject(new Error(`Some features does not have an id. Original array: ${features.length} rows: ${rows.length}`));
    }

    return rows;
  }

  private featureToDataRow(feature: Feature<Geometry>): DataRow | undefined {
    const id = feature.getId();
    if (!id) {
      return;
    }

    const properties = FeatureWrapper.from(feature).getSimpleProperties();
    return {
      ...properties,
      _id: id,
    };
  }
}
