import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Modal } from 'react-bootstrap';
import { services } from '../../../../core/Services';
import { HistoryKey } from '../../../../core/history/HistoryKey';
import { AddLayersTask } from '../../../../core/history/tasks/AddLayersTask';
import { LabelledLayerTypes, LabelledLayerType } from './LabelledLayerTypes';
import WmsSettingsPanel from './wms/WmsSettingsPanel';
import { Logger } from '../../../../core/utils/Logger';
import { Link } from 'react-router-dom';
import { FrontendRoutes, WmsDefinition } from '@abc-map/shared-entities';
import { LayerFactory } from '../../../../core/geo/layers/LayerFactory';

const logger = Logger.get('NewLayerModal.tsx');

interface Props {
  visible: boolean;
  onHide: () => void;
}

interface State {
  layerType: LabelledLayerType;
  wms?: WmsDefinition;
}

class AddLayerModal extends Component<Props, State> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {
      layerType: LabelledLayerTypes.Vector,
    };
  }

  public render(): ReactNode {
    if (!this.props.visible) {
      return <div />;
    }

    const options = this.getOptions();
    const wmsSelected = this.state.layerType.id === LabelledLayerTypes.Wms.id;
    return (
      <Modal show={this.props.visible} onHide={this.props.onHide} backdrop={'static'}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une couche</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={'mb-2'}>Sélectionnez le type de couche que vous souhaitez ajouter : </div>
          <div className={'form-group'}>
            <select value={this.state.layerType.id} onChange={this.handleLayerTypeChanged} className={'form-control'} data-cy={'add-layer-type'}>
              {options}
            </select>
          </div>
          <div className={'mb-2 mt-2'}>
            <i className={'fa fa-info ml-2 mr-2'} /> Vous pouvez aussi ajouter des couches à partir du&nbsp;
            <Link to={FrontendRoutes.dataStore()}>Catalogue de données.</Link>
          </div>

          {wmsSelected && <WmsSettingsPanel onChange={this.handleWmsSettingsChanged} />}

          <div className={'d-flex justify-content-end mt-3'}>
            <button className={'btn btn-secondary mr-3'} onClick={this.handleCancel}>
              Annuler
            </button>
            <button disabled={!this.isAddAllowed()} className={'btn btn-primary'} onClick={this.handleConfirm} data-cy={'add-layer-confirm'}>
              Ajouter
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  private handleConfirm = () => {
    const selected = this.state.layerType;
    if (LabelledLayerTypes.Vector.id === selected.id) {
      this.newVectorLayer();
    } else if (LabelledLayerTypes.Osm.id === selected.id) {
      this.newOsmLayer();
    } else if (LabelledLayerTypes.Wms.id === selected.id) {
      this.newWmsLayer();
    } else {
      this.services.ui.toasts.genericError();
    }

    this.setState({ layerType: LabelledLayerTypes.Vector, wms: undefined });
    this.props.onHide();
  };

  private handleCancel = () => {
    this.setState({ layerType: LabelledLayerTypes.Vector, wms: undefined });
    this.props.onHide();
  };

  private getOptions(): ReactNode[] {
    return LabelledLayerTypes.All.map((type) => {
      return (
        <option key={type.id} value={type.id}>
          {type.label}
        </option>
      );
    });
  }

  private handleLayerTypeChanged = (ev: ChangeEvent<HTMLSelectElement>) => {
    const value = ev.target.value;
    const layerType = LabelledLayerTypes.find(value);
    if (!layerType) {
      return this.services.ui.toasts.genericError();
    }
    this.setState({ layerType });
  };

  private newOsmLayer = () => {
    const map = this.services.geo.getMainMap();
    const layer = LayerFactory.newOsmLayer();
    map.addLayer(layer);
    map.setActiveLayer(layer);
    this.services.history.register(HistoryKey.Map, new AddLayersTask(map, [layer]));
  };

  private newVectorLayer = () => {
    const map = this.services.geo.getMainMap();
    const layer = LayerFactory.newVectorLayer();
    map.addLayer(layer);
    map.setActiveLayer(layer);
    this.services.history.register(HistoryKey.Map, new AddLayersTask(map, [layer]));
  };

  private newWmsLayer = () => {
    const wms = this.state.wms;
    if (!wms) {
      return this.services.ui.toasts.info("Vous devez d'abord paramétrer votre couche");
    }

    const map = this.services.geo.getMainMap();
    const layer = LayerFactory.newWmsLayer(wms);
    map.addLayer(layer);
    map.setActiveLayer(layer);
    this.services.history.register(HistoryKey.Map, new AddLayersTask(map, [layer]));
  };

  private handleWmsSettingsChanged = (wms: WmsDefinition) => {
    logger.info('Settings changed: ', wms);
    this.setState({ wms });
  };

  // TODO: we should return an explanation and display it
  private isAddAllowed(): boolean {
    if (this.state.layerType !== LabelledLayerTypes.Wms) {
      return true;
    }
    const urlIsDefined = !!this.state.wms?.remoteUrl;
    const layerIsDefined = !!this.state.wms?.remoteLayerName;
    return urlIsDefined && layerIsDefined;
  }
}

export default AddLayerModal;
