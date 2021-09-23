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
import { BasicAuthentication, Logger } from '@abc-map/shared';
import { WmsCapabilities, WmsLayer } from '../../../../../core/geo/WmsCapabilities';
import WmsLayerItem from './WmsLayerItem';
import { ServiceProps, withServices } from '../../../../../core/withServices';
import FormValidationLabel from '../../../../../components/form-validation-label/FormValidationLabel';
import { ValidationHelper } from '../../../../../core/utils/ValidationHelper';
import { FormState } from '../../../../../components/form-validation-label/FormState';
import { LayerFactory } from '../../../../../core/geo/layers/LayerFactory';
import { HistoryKey } from '../../../../../core/history/HistoryKey';
import { AddLayersTask } from '../../../../../core/history/tasks/layers/AddLayersTask';
import ControlButtons from '../_common/ControlButtons';
import { WmsSettings } from '../../../../../core/geo/layers/LayerFactory.types';
import { removeQuery } from '../../../../../core/utils/removeQuery';
import Cls from './WmsLayerPanel.module.scss';

const logger = Logger.get('WmsLayerPanel.tsx');

interface Props extends ServiceProps {
  value: WmsSettings;
  onChange: (values: WmsSettings) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

interface State {
  capabilities?: WmsCapabilities;
  formState: FormState;
  loading: boolean;
}

class WmsLayerPanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { formState: FormState.InvalidUrl, loading: false };
  }

  public render(): ReactNode {
    const value = this.props.value;
    const capabilities = this.state.capabilities;
    const formState = this.state.formState;
    const layers = capabilities?.Capability?.Layer?.Layer || [];
    const loading = this.state.loading;
    const onCancel = this.props.onCancel;
    const submitDisabled = formState !== FormState.Ok;
    const protocolWarn = this.props.value.remoteUrl.toLocaleLowerCase().includes('wmts');

    return (
      <div className={'flex-grow-1 d-flex flex-column justify-content-between'}>
        <div className={'mb-2'}>Pour le moment, seules les projections EPSG:4326 et EPSG:3857 sont supportées.</div>

        {/* URL and credentials form */}
        <div className={'d-flex flex-row'}>
          <input
            type="text"
            placeholder={'URL'}
            className={'form-control mb-3'}
            value={value?.remoteUrl}
            onChange={this.handleUrlChanged}
            data-cy={'wms-settings-url'}
          />
        </div>

        {/* Warning if URL seems to belong to use protocol */}
        {protocolWarn && <div className={`mb-3 ${Cls.warn}`}>⚠️ L&apos;URL contient &apos;WMTS&apos;. Etes vous sûr de vouloir ajouter une couche WMS ?</div>}

        <div className={'d-flex flex-row mb-3'}>
          <input
            type={'text'}
            value={value?.auth?.username}
            onChange={this.handleUsernameChanged}
            className={'form-control mr-2'}
            placeholder={"Nom d'utilisateur (optionnel)"}
            data-cy={'wms-settings-username'}
          />
          <input
            type={'password'}
            value={value?.auth?.password}
            onChange={this.handlePasswordChanged}
            className={'form-control'}
            placeholder={'Mot de passe (optionnel)'}
            data-cy={'wms-settings-password'}
          />
        </div>

        <div className={'d-flex justify-content-end mb-3'}>
          <button onClick={this.fetchCapabilities} disabled={loading} data-cy={'wms-settings-capabilities'} className={'btn btn-primary ml-2'}>
            Lister les couches disponibles
          </button>
        </div>

        {loading && <div className={'p-3 text-center'}>Chargement ...</div>}

        {capabilities && (
          <>
            <div className={'mb-2'}>Sélectionnez une couche : </div>
            <div className={Cls.wmsLayerSelector}>
              {layers.length < 1 && <div className={'p-3 text-center'}>Pas de couche disponible</div>}
              {layers.map((lay, i) => (
                <WmsLayerItem key={`${lay.Name}-${i}`} layer={lay} selected={value?.remoteLayerName === lay.Name} onSelected={this.handleLayerSelected} />
              ))}
            </div>
          </>
        )}

        <FormValidationLabel state={formState} />

        <ControlButtons onCancel={onCancel} onConfirm={this.handleConfirm} submitDisabled={submitDisabled} />
      </div>
    );
  }

  public componentDidMount() {
    // We validate form on mount, in case of a pre exising state
    const formState = this.validateForm(this.props.value);
    this.setState({ formState });
  }

  private handleUrlChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    const url = ev.target.value;

    const values: WmsSettings = {
      ...this.props.value,
      remoteUrl: url,
    };

    const formState = this.validateForm(values);
    this.setState({ formState }, () => this.props.onChange(values));
  };

  private handleLayerSelected = (layer: WmsLayer) => {
    const { toasts } = this.props.services;

    try {
      const values = this.getValues(layer);
      const formState = this.validateForm(values);
      this.setState({ formState }, () => this.props.onChange(values));
    } catch (err) {
      logger.error('Cannot use layer: ', err);
      toasts.error('Désolé, cette couche ne peut pas être utilisée');
    }
  };

  private getValues(layer: WmsLayer): WmsSettings {
    const layerName = layer.Name || '';

    // FIXME: what if the projection is not registered ?
    const boundingBox = layer.BoundingBox?.length ? layer.BoundingBox[0] : undefined;
    const projection = boundingBox?.crs ? { name: boundingBox.crs } : undefined;
    const extent = boundingBox?.extent;

    return {
      ...this.props.value,
      remoteLayerName: layerName,
      extent,
      projection,
    };
  }

  private handleUsernameChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    const username = ev.target.value;

    const values: WmsSettings = {
      ...this.props.value,
      auth: {
        username,
        password: this.props.value.auth?.password || '',
      },
    };

    const formState = this.validateForm(values);
    this.setState({ formState }, () => this.props.onChange(values));
  };

  private handlePasswordChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    const password = ev.target.value;

    const values: WmsSettings = {
      ...this.props.value,
      auth: {
        password,
        username: this.props.value.auth?.username || '',
      },
    };

    const formState = this.validateForm(values);
    this.setState({ formState }, () => this.props.onChange(values));
  };

  private fetchCapabilities = () => {
    const { geo, toasts } = this.props.services;
    const value = this.props.value;

    this.setState({ loading: true });

    let auth: BasicAuthentication | undefined;
    if (value.auth?.username && value.auth?.password) {
      auth = { username: value.auth.username, password: value.auth.password };
    }

    geo
      .getWmsCapabilities(value.remoteUrl, auth)
      .then((capabilities) => this.setState({ capabilities }))
      .catch((err) => {
        toasts.error("Impossible d'obtenir les capacités du serveur, vérifiez l'url");
        logger.error(err);
      })
      .finally(() => this.setState({ loading: false }));
  };

  private handleConfirm = () => {
    const { history, geo } = this.props.services;

    const wmsOptions: WmsSettings = {
      ...this.props.value,
      remoteUrl: removeQuery(this.props.value.remoteUrl),
    };

    const map = geo.getMainMap();
    const layer = LayerFactory.newWmsLayer(wmsOptions);
    map.addLayer(layer);
    map.setActiveLayer(layer);
    history.register(HistoryKey.Map, new AddLayersTask(map, [layer]));

    this.props.onConfirm();
  };

  private validateForm(value: WmsSettings): FormState {
    if (!ValidationHelper.url(value.remoteUrl)) {
      return FormState.InvalidUrl;
    }

    if (!value.remoteLayerName) {
      return FormState.MissingRemoteLayer;
    }

    return FormState.Ok;
  }
}

export default withServices(WmsLayerPanel);
