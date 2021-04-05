import { LayerFactory } from '../../../core/geo/layers/LayerFactory';
import { LayerDataSource } from './LayerDataSource';
import { DataSourceType } from './DataSource';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';

describe('LayerDataSource', () => {
  it('getId()', () => {
    const layer = LayerFactory.newVectorLayer();
    const data = new LayerDataSource(layer);

    expect(data.getId()).toEqual(layer.getId());
  });

  it('getType()', () => {
    const data = new LayerDataSource(LayerFactory.newVectorLayer());

    expect(data.getType()).toEqual(DataSourceType.VectorLayer);
  });

  it('getRows() should return rows', async () => {
    const feat1 = new Feature({ label: 'value1', altitude: 1234 });
    feat1.setId(1);
    const feat2 = new Feature({ label: 'value2', altitude: 5678 });
    feat2.setId(2);
    const source = new VectorSource();
    source.addFeatures([feat1, feat2]);
    const data = new LayerDataSource(LayerFactory.newVectorLayer(source));

    const rows = await data.getRows();

    expect(rows).toEqual([
      { _id: 1, label: 'value1', altitude: 1234 },
      { _id: 2, label: 'value2', altitude: 5678 },
    ]);
  });

  it('getRows() should return empty array', async () => {
    const source = new VectorSource();
    const data = new LayerDataSource(LayerFactory.newVectorLayer(source));

    const rows = await data.getRows();

    expect(rows).toHaveLength(0);
  });
});
