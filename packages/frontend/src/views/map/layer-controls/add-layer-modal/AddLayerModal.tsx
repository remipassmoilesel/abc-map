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
import { LabelledLayerTypes, LabelledLayerType } from './LabelledLayerTypes';
import WmsSettingsPanel from './wms/WmsSettingsPanel';
import { Logger } from '@abc-map/shared';
import { Link } from 'react-router-dom';
import { WmsDefinition } from '@abc-map/shared';
import { FrontendRoutes } from '@abc-map/shared';
import { LayerFactory } from '../../../../core/geo/layers/LayerFactory';
import { ServiceProps, withServices } from '../../../../core/withServices';

const logger = Logger.get('NewLayerModal.tsx');

interface LocalProps {
  visible: boolean;
  onHide: () => void;
}

interface State {
  layerType: LabelledLayerType;
  wms?: WmsDefinition;
}

declare type Props = LocalProps & ServiceProps;

class AddLayerModal extends Component<Props, State> {
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
            <Link to={FrontendRoutes.dataStore().raw()}>Catalogue de données.</Link>
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
    const { toasts } = this.props.services;

    const selected = this.state.layerType;
    if (LabelledLayerTypes.Vector.id === selected.id) {
      this.newVectorLayer();
    } else if (LabelledLayerTypes.Osm.id === selected.id) {
      this.newOsmLayer();
    } else if (LabelledLayerTypes.Wms.id === selected.id) {
      this.newWmsLayer();
    } else {
      toasts.genericError();
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
    const { toasts } = this.props.services;

    const value = ev.target.value;
    const layerType = LabelledLayerTypes.find(value);
    if (!layerType) {
      return toasts.genericError();
    }
    this.setState({ layerType });
  };

  private newOsmLayer = () => {
    const { history, geo } = this.props.services;

    const map = geo.getMainMap();
    const layer = LayerFactory.newOsmLayer();
    map.addLayer(layer);
    map.setActiveLayer(layer);
    history.register(HistoryKey.Map, new AddLayersTask(map, [layer]));
  };

  private newVectorLayer = () => {
    const { history, geo } = this.props.services;

    const map = geo.getMainMap();
    const layer = LayerFactory.newVectorLayer();
    map.addLayer(layer);
    map.setActiveLayer(layer);
    history.register(HistoryKey.Map, new AddLayersTask(map, [layer]));
  };

  private newWmsLayer = () => {
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

export default withServices(AddLayerModal);
