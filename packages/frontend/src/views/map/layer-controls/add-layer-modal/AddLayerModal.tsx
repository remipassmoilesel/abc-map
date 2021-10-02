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
import { LabeledLayerType, LabeledLayerTypes } from './_common/LabeledLayerTypes';
import WmsLayerPanel from './wms/WmsLayerPanel';
import { Logger, PredefinedLayerModel } from '@abc-map/shared';
import { ServiceProps, withServices } from '../../../../core/withServices';
import PredefinedPanel from './predefined/PredefinedLayerPanel';
import XYZLayerPanel from './xyz/XYZLayerPanel';
import Cls from './AddLayerModal.module.scss';
import GeometryLayerPanel from './geometry/GeometryLayerPanel';
import HelpPanel from './help-panel/HelpPanel';
import WmtsLayerPanel from './wmts/WmtsLayerPanel';
import { WmsSettings, WmtsSettings } from '../../../../core/geo/layers/LayerFactory.types';
import { MainState } from '../../../../core/store/reducer';
import { connect, ConnectedProps } from 'react-redux';

const logger = Logger.get('AddLayerModal.tsx');

interface LocalProps extends ServiceProps {
  visible: boolean;
  onHide: () => void;
}

const mapStateToProps = (state: MainState) => ({
  projection: state.project.view.projection,
});

const connector = connect(mapStateToProps);

declare type Props = LocalProps & ConnectedProps<typeof connector>;

interface State {
  layerType: LabeledLayerType;
  predefinedModel: PredefinedLayerModel;
  wms?: WmsSettings;
  wmts?: WmtsSettings;
  xyzUrl?: string;
}

export const EmptyWmsValues: WmsSettings = {
  capabilitiesUrl: '',
  remoteUrls: [],
  remoteLayerName: '',
  auth: {
    password: '',
    username: '',
  },
};

export const EmptyWmtsValues: WmtsSettings = {
  capabilitiesUrl: '',
  remoteLayerName: '',
  auth: {
    username: '',
    password: '',
  },
};

class AddLayerModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      layerType: LabeledLayerTypes.Predefined,
      predefinedModel: PredefinedLayerModel.StamenWatercolor,
    };
  }

  public render(): ReactNode {
    const visible = this.props.visible;
    if (!visible) {
      return <div />;
    }

    const onHide = this.props.onHide;
    const layerTypeId = this.state.layerType.id;
    const predefinedValues = this.state.predefinedModel;
    const xyzValues = this.state.xyzUrl || '';
    const wmsValues = this.state.wms || EmptyWmsValues;
    const wmtsValues = this.state.wmts || EmptyWmtsValues;
    const projection = this.props.projection;

    const predefinedSelected = layerTypeId === LabeledLayerTypes.Predefined.id;
    const geometrySelected = layerTypeId === LabeledLayerTypes.Vector.id;
    const xyzSelected = layerTypeId === LabeledLayerTypes.Xyz.id;
    const wmsSelected = layerTypeId === LabeledLayerTypes.Wms.id;
    const wmtsSelected = layerTypeId === LabeledLayerTypes.Wmts.id;

    return (
      <Modal show={true} onHide={onHide} dialogClassName={Cls.modal}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une couche 🗺️</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={`p-3`}>
            <div className={`mb-4 ${Cls.subTitle}`}>Quelle type de couche souhaitez-vous ajouter ?</div>
            <div className={'d-flex'}>
              <div className={Cls.leftPanel}>
                {/* Type selector */}
                <select value={layerTypeId} onChange={this.handleLayerTypeChange} className={'form-control'} data-cy={'add-layer-type'}>
                  {LabeledLayerTypes.All.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>

                {/* Advice */}
                <HelpPanel type={layerTypeId} />
              </div>

              {/* Settings panels */}
              <div className={Cls.rightPanel}>
                {predefinedSelected && (
                  <PredefinedPanel value={predefinedValues} onChange={this.handlePredefinedValueChanged} onCancel={onHide} onConfirm={onHide} />
                )}
                {geometrySelected && <GeometryLayerPanel onConfirm={onHide} onCancel={onHide} />}
                {xyzSelected && <XYZLayerPanel value={xyzValues} onChange={this.handleXyzValuesChange} onConfirm={onHide} onCancel={onHide} />}
                {wmsSelected && (
                  <WmsLayerPanel projectProjection={projection} value={wmsValues} onChange={this.handleWmsValuesChange} onConfirm={onHide} onCancel={onHide} />
                )}
                {wmtsSelected && <WmtsLayerPanel value={wmtsValues} onChange={this.handleWmtsValuesChange} onConfirm={onHide} onCancel={onHide} />}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  private handleLayerTypeChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    const value = ev.target.value;
    const layerType = LabeledLayerTypes.find(value);
    if (!layerType) {
      logger.error('Invalid type: ', value);
      return;
    }

    this.setState({ layerType });
  };

  private handleWmsValuesChange = (wms: WmsSettings) => {
    this.setState({ wms });
  };

  private handleWmtsValuesChange = (wmts: WmtsSettings) => {
    this.setState({ wmts });
  };

  private handleXyzValuesChange = (xyzUrl: string) => {
    this.setState({ xyzUrl });
  };

  private handlePredefinedValueChanged = (predefinedModel: PredefinedLayerModel) => {
    this.setState({ predefinedModel });
  };
}

export default connector(withServices(AddLayerModal));
