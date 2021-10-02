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
import WmtsLayerItem from './WmtsLayerItem';
import { ServiceProps, withServices } from '../../../../../core/withServices';
import FormValidationLabel from '../../../../../components/form-validation-label/FormValidationLabel';
import { ValidationHelper } from '../../../../../core/utils/ValidationHelper';
import { FormState } from '../../../../../components/form-validation-label/FormState';
import { HistoryKey } from '../../../../../core/history/HistoryKey';
import { AddLayersTask } from '../../../../../core/history/tasks/layers/AddLayersTask';
import ControlButtons from '../_common/ControlButtons';
import { WmtsCapabilities, WmtsLayer } from '../../../../../core/geo/WmtsCapabilities';
import { WmtsSettings } from '../../../../../core/geo/layers/LayerFactory.types';
import { LayerFactory } from '../../../../../core/geo/layers/LayerFactory';
import Cls from './WmtsLayerPanel.module.scss';

const logger = Logger.get('WmtsLayerPanel.tsx');

interface Props extends ServiceProps {
  value: WmtsSettings;
  onChange: (values: WmtsSettings) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

interface State {
  capabilities?: WmtsCapabilities;
  formState: FormState;
  loading: boolean;
}

class WmtsLayerPanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { formState: FormState.InvalidUrl, loading: false };
  }

  public render(): ReactNode {
    const value = this.props.value;
    const capabilities = this.state.capabilities;
    const formState = this.state.formState;
    const layers = capabilities?.Contents?.Layer || [];
    const loading = this.state.loading;
    const onCancel = this.props.onCancel;
    const submitDisabled = formState !== FormState.Ok;
    const protocolWarn = this.props.value.capabilitiesUrl?.toLocaleLowerCase().includes('wms');

    return (
      <div className={'flex-grow-1 d-flex flex-column justify-content-between'}>
        {/* URL and credentials form */}
        <div className={'d-flex flex-row'}>
          <input
            type="text"
            placeholder={'URL'}
            className={'form-control mb-3'}
            value={value?.capabilitiesUrl}
            onChange={this.handleUrlChanged}
            data-cy={'wmts-settings-url'}
          />
        </div>

        {/* Warning if URL seems to belong to use protocol */}
        {protocolWarn && <div className={`mb-3 ${Cls.warn}`}>⚠️ L&apos;URL contient &apos;WMS&apos;. Etes vous sûr de vouloir ajouter une couche WMTS ?</div>}

        <div className={'d-flex flex-row mb-3'}>
          <input
            type={'text'}
            value={value?.auth?.username}
            onChange={this.handleUsernameChanged}
            className={'form-control mr-2'}
            placeholder={"Nom d'utilisateur (optionnel)"}
            data-cy={'wmts-settings-username'}
          />
          <input
            type={'password'}
            value={value?.auth?.password}
            onChange={this.handlePasswordChanged}
            className={'form-control'}
            placeholder={'Mot de passe (optionnel)'}
            data-cy={'wmts-settings-password'}
          />
        </div>

        {/* Capabilities and layers selection */}
        <div className={'d-flex justify-content-end mb-3'}>
          <button onClick={this.fetchCapabilities} disabled={loading} data-cy={'wmts-settings-capabilities'} className={'btn btn-primary ml-2'}>
            Lister les couches disponibles
          </button>
        </div>

        {loading && <div className={'p-3 text-center'}>Chargement ...</div>}

        {capabilities && (
          <>
            <div className={'mb-2'}>Sélectionnez une couche : </div>
            <div className={Cls.wmtsLayerSelector}>
              {layers.length < 1 && <div className={'p-3 text-center'}>Pas de couche disponible</div>}
              {layers.map((lay, i) => (
                <WmtsLayerItem
                  key={`${lay.Identifier}-${i}`}
                  layer={lay}
                  selected={value?.remoteLayerName === lay.Identifier}
                  onSelected={this.handleLayerSelected}
                />
              ))}
            </div>
          </>
        )}

        {/* Form validation and controls */}
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

    const values: WmtsSettings = {
      ...this.props.value,
      capabilitiesUrl: url,
    };

    const formState = this.validateForm(values);
    this.setState({ formState }, () => this.props.onChange(values));
  };

  private handleLayerSelected = (layer: WmtsLayer) => {
    const { toasts } = this.props.services;

    this.getValues(layer)
      .then((values) => {
        const formState = this.validateForm(values);
        this.setState({ formState }, () => this.props.onChange(values));
      })
      .catch((err) => {
        logger.error('Cannot use layer: ', err);
        toasts.error('Désolé, cette couche ne peut pas être utilisée');
      });
  };

  private async getValues(layer: WmtsLayer): Promise<WmtsSettings> {
    const { geo } = this.props.services;

    const remoteLayerName = layer.Identifier;
    if (!remoteLayerName) {
      return Promise.reject(new Error('Layer does not have identifier'));
    }

    const capabilities = this.state.capabilities;
    if (!capabilities) {
      return Promise.reject(new Error('Capabilities not ready'));
    }

    const options = await geo.getWmtsLayerOptions(remoteLayerName, capabilities);

    return {
      ...this.props.value,
      remoteLayerName,
      sourceOptions: options,
    };
  }

  private handleUsernameChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    const username = ev.target.value;

    const values: WmtsSettings = {
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

    const values: WmtsSettings = {
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

    if (!value.capabilitiesUrl) {
      toasts.error("L'URL est obligatoire.");
      return;
    }

    this.setState({ loading: true, capabilities: undefined });

    let auth: BasicAuthentication | undefined;
    if (value.auth?.username && value.auth?.password) {
      auth = { username: value.auth.username, password: value.auth.password };
    }

    geo
      .getWmtsCapabilities(value.capabilitiesUrl, auth)
      .then((capabilities) => this.setState({ capabilities }))
      .catch((err) => {
        toasts.error("Impossible d'obtenir les capacités du serveur, vérifiez l'URL et les identifiants");
        logger.error(err);
      })
      .finally(() => this.setState({ loading: false }));
  };

  private handleConfirm = () => {
    const { history, geo } = this.props.services;
    const { value: settings } = this.props;

    const map = geo.getMainMap();
    const layer = LayerFactory.newWmtsLayer(settings);
    map.addLayer(layer);
    map.setActiveLayer(layer);
    history.register(HistoryKey.Map, new AddLayersTask(map, [layer]));

    this.props.onConfirm();
  };

  private validateForm(value: WmtsSettings): FormState {
    if (!ValidationHelper.url(value.capabilitiesUrl || '')) {
      return FormState.InvalidUrl;
    }

    if (!value.remoteLayerName) {
      return FormState.MissingRemoteLayer;
    }

    return FormState.Ok;
  }
}

export default withServices(WmtsLayerPanel);
