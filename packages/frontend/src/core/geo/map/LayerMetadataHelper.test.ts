import { LayerFactory } from './LayerFactory';
import { LayerProperties } from '@abc-map/shared-entities';
import { LayerType } from '@abc-map/shared-entities';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { LayerMetadataHelper, logger } from './LayerMetadataHelper';

logger.disable();

// TODO: improve tests
describe('LayerMetadataHelper', () => {
  it('getCommons() on non managed layer', () => {
    const layer = new VectorLayer();
    const metadata = LayerMetadataHelper.getCommons(layer);
    expect(metadata).toBeUndefined();
  });

  it('getCommons()', () => {
    const layer = LayerFactory.newVectorLayer(new VectorSource());
    layer.set(LayerProperties.Active, true);
    layer.setVisible(false);
    layer.setOpacity(0.5);

    const metadata = LayerMetadataHelper.getCommons(layer);
    expect(metadata?.id).toBeDefined();

    expect(metadata?.id).toEqual(layer.get(LayerProperties.Id));
    expect(metadata?.type).toEqual(LayerType.Vector);
    expect(metadata?.opacity).toEqual(0.5);
    expect(metadata?.visible).toEqual(false);
    expect(metadata?.active).toEqual(true);
    expect(metadata?.type).toEqual(LayerType.Vector);
  });
});
