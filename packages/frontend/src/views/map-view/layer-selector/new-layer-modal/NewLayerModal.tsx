import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Modal } from 'react-bootstrap';
import { services } from '../../../../core/Services';
import { HistoryKey } from '../../../../core/history/HistoryKey';
import { AddLayerTask } from '../../../../core/history/tasks/AddLayerTask';
import { AddLayerType, AddLayerTypes } from './AddLayerType';

interface Props {
  visible: boolean;
  onHide: () => void;
}

interface State {
  layerType: AddLayerType;
}

class NewLayerModal extends Component<Props, State> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {
      layerType: AddLayerTypes.Vector,
    };
  }

  public render(): ReactNode {
    if (!this.props.visible) {
      return <div />;
    }

    const options = this.getOptions();
    return (
      <Modal show={this.props.visible} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une couche</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Sélectionnez la couche que vous souhaitez ajouter : </div>
          <div className={'form-group'}>
            <select value={this.state.layerType.id} onChange={this.onLayerTypeChanged} className={'form-control'} data-cy={'add-layer-type'}>
              {options}
            </select>
          </div>
          <div className={'d-flex justify-content-end'}>
            <button className={'btn btn-secondary mr-3'} onClick={this.props.onHide}>
              Annuler
            </button>
            <button className={'btn btn-primary'} onClick={this.onAdd} data-cy={'add-layer-confirm'}>
              Ajouter
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  private onAdd = () => {
    const selected = this.state.layerType;
    if (AddLayerTypes.Vector.id === selected.id) {
      this.newVectorLayer();
    } else if (AddLayerTypes.Osm.id === selected.id) {
      this.newOsmLayer();
    } else {
      this.services.ui.toasts.featureNotReady();
    }
    this.props.onHide();
  };

  private getOptions(): ReactNode[] {
    return AddLayerTypes.All.map((type) => {
      return (
        <option key={type.id} value={type.id}>
          {type.label}
        </option>
      );
    });
  }

  private onLayerTypeChanged = (ev: ChangeEvent<HTMLSelectElement>) => {
    const value = ev.target.value;
    const layerType = AddLayerTypes.find(value);
    if (!layerType) {
      return this.services.ui.toasts.genericError();
    }
    this.setState({ layerType });
  };

  private newOsmLayer = () => {
    const map = this.services.geo.getMainMap();
    const layer = this.services.geo.newOsmLayer();
    map.addLayer(layer);
    map.setActiveLayer(layer);
    this.services.history.register(HistoryKey.Map, new AddLayerTask(map, layer));
  };

  private newVectorLayer = () => {
    const map = this.services.geo.getMainMap();
    const layer = this.services.geo.newVectorLayer();
    map.addLayer(layer);
    map.setActiveLayer(layer);
    this.services.history.register(HistoryKey.Map, new AddLayerTask(map, layer));
  };
}

export default NewLayerModal;
