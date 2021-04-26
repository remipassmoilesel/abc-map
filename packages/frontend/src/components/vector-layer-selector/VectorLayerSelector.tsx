import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import { ServiceProps, withServices } from '../../core/withServices';
import { LayerChangeHandler } from '../../core/geo/map/MapWrapper';
import { LayerWrapper, VectorLayerWrapper } from '../../core/geo/layers/LayerWrapper';

const logger = Logger.get('VectorLayerSelector.tsx');

interface Props extends ServiceProps {
  /**
   * The selected layer id
   */
  value?: string;
  /**
   * Triggered on layer selected
   */
  onSelected: (lay: VectorLayerWrapper | undefined) => void;

  'data-cy'?: string;
}

interface State {
  layers: LayerWrapper[];
  layerChangeHandler?: LayerChangeHandler;
}

const None = 'None';

class VectorLayerSelector extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { layers: [] };
  }

  public render(): ReactNode {
    const value = this.props.value || None;
    const layers = this.state.layers;
    const dataCy = this.props['data-cy'];

    return (
      <select onChange={this.handleSelection} value={value} className={'form-control'} data-cy={dataCy}>
        <option value={None}>Sélectionnez une couche</option>
        {layers.map((lay) => (
          <option key={lay.getId()} value={lay.getId()}>
            {lay.getName()}
          </option>
        ))}
      </select>
    );
  }

  public componentDidMount() {
    const map = this.props.services.geo.getMainMap();

    // We listen layer changes
    const layerChangeHandler = () => {
      this.setState({ layers: map.getLayers().filter((lay) => lay.isVector()) });
    };
    map.addLayerChangeListener(layerChangeHandler);

    // We list layers a first time
    const layers = map.getLayers().filter((lay) => lay.isVector());
    this.setState({ layerChangeHandler, layers });
  }

  public componentWillUnmount() {
    const map = this.props.services.geo.getMainMap();

    const layerChangeHandler = this.state.layerChangeHandler;
    layerChangeHandler && map.removeLayerChangeListener(layerChangeHandler);
  }

  private handleSelection = (ev: ChangeEvent<HTMLSelectElement>) => {
    const layerId = ev.target.value;
    const { geo } = this.props.services;

    if (!layerId || layerId === None) {
      this.props.onSelected(undefined);
      return;
    }

    const layer = geo
      .getMainMap()
      .getLayers()
      .find((lay) => lay.getId() === layerId);

    if (!layer || !layer.isVector()) {
      logger.error('Layer not found');
      this.props.onSelected(undefined);
      return;
    }

    this.props.onSelected(layer);
  };
}

export default withServices(VectorLayerSelector);
