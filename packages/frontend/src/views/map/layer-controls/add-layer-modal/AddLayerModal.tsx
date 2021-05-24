/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Modal } from 'react-bootstrap';
import { HistoryKey } from '../../../../core/history/HistoryKey';
import { AddLayersTask } from '../../../../core/history/tasks/layers/AddLayersTask';
import { LabelledLayerType, LabelledLayerTypes } from './LabelledLayerTypes';
import WmsSettingsPanel from './wms/WmsSettingsPanel';
import { FrontendRoutes, Logger, PredefinedLayerModel, WmsDefinition } from '@abc-map/shared';
import { Link } from 'react-router-dom';
import { LayerFactory } from '../../../../core/geo/layers/LayerFactory';
import { ServiceProps, withServices } from '../../../../core/withServices';
import PredefinedSelector from './predefined/PredefinedSelector';

const logger = Logger.get('AddLayerModal.tsx');

interface LocalProps {
  visible: boolean;
  onHide: () => void;
}

interface State {
  layerType: LabelledLayerType;
  predefinedModel: PredefinedLayerModel;
  wms?: WmsDefinition;
}

declare type Props = LocalProps & ServiceProps;

class AddLayerModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      layerType: LabelledLayerTypes.Vector,
      predefinedModel: PredefinedLayerModel.OSM,
    };
  }

  public render(): ReactNode {
    const visible = this.props.visible;
    if (!visible) {
      // We keep modal always mounted in order to keep state between displays
      return <div />;
    }

    const onHide = this.props.onHide;
    const layerTypeId = this.state.layerType.id;
    const predefinedModel = this.state.predefinedModel;
    const baseMapSelected = layerTypeId === LabelledLayerTypes.BaseMap.id;
    const wmsSelected = layerTypeId === LabelledLayerTypes.Wms.id;
    return (
      <Modal show={true} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une couche</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={'mb-2'}>Sélectionnez le type de couche que vous souhaitez ajouter : </div>
          <div className={'form-group'}>
            <select value={layerTypeId} onChange={this.handleLayerTypeChanged} className={'form-control'} data-cy={'add-layer-type'}>
              {LabelledLayerTypes.All.map((type) => {
                return (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                );
              })}
            </select>
          </div>

          <div className={'my-2'}>
            <i className={'fa fa-info mx-2'} /> Vous pouvez aussi ajouter des couches à partir du&nbsp;
            <Link to={FrontendRoutes.dataStore().raw()}>Catalogue de données.</Link>
          </div>

          {baseMapSelected && <PredefinedSelector value={predefinedModel} onChange={this.handleBaseMapChanged} />}
          {wmsSelected && <WmsSettingsPanel onChange={this.handleWmsSettingsChanged} />}

          <div className={'d-flex justify-content-end mt-3'}>
            <button className={'btn btn-secondary mr-3'} onClick={onHide}>
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
    const { toasts } = this.props.services;

    const selected = this.state.layerType;
    if (LabelledLayerTypes.BaseMap.id === selected.id) {
      this.handleNewBaseMap();
    } else if (LabelledLayerTypes.Vector.id === selected.id) {
      this.handleNewVectorLayer();
    } else if (LabelledLayerTypes.Wms.id === selected.id) {
      this.handleNewWmsLayer();
    } else {
      toasts.genericError();
    }

    this.props.onHide();
  };

  private handleLayerTypeChanged = (ev: ChangeEvent<HTMLSelectElement>) => {
    const { toasts } = this.props.services;

    const value = ev.target.value;
    const layerType = LabelledLayerTypes.find(value);
    if (!layerType) {
      return toasts.genericError();
    }
    this.setState({ layerType });
  };

  private handleNewBaseMap = () => {
    const { geo, history } = this.props.services;
    const { predefinedModel } = this.state;

    const map = geo.getMainMap();
    const layer = LayerFactory.newPredefinedLayer(predefinedModel);
    map.addLayer(layer);
    map.setActiveLayer(layer);
    history.register(HistoryKey.Map, new AddLayersTask(map, [layer]));
  };

  private handleNewVectorLayer = () => {
    const { history, geo } = this.props.services;

    const map = geo.getMainMap();
    const layer = LayerFactory.newVectorLayer();
    map.addLayer(layer);
    map.setActiveLayer(layer);
    history.register(HistoryKey.Map, new AddLayersTask(map, [layer]));
  };

  private handleNewWmsLayer = () => {
    const { history, geo, toasts } = this.props.services;

    const wms = this.state.wms;
    if (!wms) {
      return toasts.info("Vous devez d'abord paramétrer votre couche");
    }

    const map = geo.getMainMap();
    const layer = LayerFactory.newWmsLayer(wms);
    map.addLayer(layer);
    map.setActiveLayer(layer);
    history.register(HistoryKey.Map, new AddLayersTask(map, [layer]));
  };

  private handleWmsSettingsChanged = (wms: WmsDefinition) => {
    this.setState({ wms });
  };

  private handleBaseMapChanged = (predefinedModel: PredefinedLayerModel) => {
    this.setState({ predefinedModel });
  };

  private isAddAllowed(): boolean {
    if (this.state.layerType !== LabelledLayerTypes.Wms) {
      return true;
    }
    const urlIsDefined = !!this.state.wms?.remoteUrl;
    const layerIsDefined = !!this.state.wms?.remoteLayerName;
    return urlIsDefined && layerIsDefined;
  }
}

export default withServices(AddLayerModal);
