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
import { Logger } from '@abc-map/shared';
import { WmsBoundingBox, WmsCapabilities, WmsLayer } from '../../../../../core/geo/WmsCapabilities';
import WmsLayerItem from './WmsLayerItem';
import { AbcProjection, WmsAuthentication, WmsDefinition } from '@abc-map/shared';
import { ServiceProps, withServices } from '../../../../../core/withServices';
import './WmsSettingsPanel.scss';

const logger = Logger.get('WmsSettingsPanel.tsx', 'debug');

interface LocalProps {
  onChange: (wms: WmsDefinition) => void;
}

interface State {
  url: string;
  capabilities?: WmsCapabilities;
  selectedLayer?: WmsLayer;
  username: string;
  password: string;
}

declare type Props = LocalProps & ServiceProps;

class WmsSettingsPanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      url: '',
      username: '',
      password: '',
    };
  }

  public render(): ReactNode {
    const url = this.state.url;
    const capabilities = this.state.capabilities;
    const selectedLayer = this.state.selectedLayer;
    const username = this.state.username;
    const password = this.state.password;
    return (
      <div className={'abc-wms-settings'}>
        <div className={'form-group d-flex flex-row'}>
          <input type="text" placeholder={'URL'} className={'form-control'} value={url} onChange={this.handleUrlChanged} data-cy={'wms-settings-url'} />
        </div>
        <div className={'d-flex flex-column'}>
          <div className={'form-group'}>
            <input
              type={'text'}
              value={username}
              onChange={this.handleUsernameChanged}
              className={'form-control mb-2'}
              placeholder={"Nom d'utilisateur (optionnel)"}
              data-cy={'wms-settings-username'}
            />
            <input
              type={'password'}
              value={password}
              onChange={this.handlePasswordChanged}
              className={'form-control mb-2'}
              placeholder={'Mot de passe (optionnel)'}
              data-cy={'wms-settings-password'}
            />
          </div>
        </div>
        <div className={'d-flex justify-content-end'}>
          <button className={'btn btn-primary ml-2'} onClick={this.getCapabilities} data-cy={'wms-settings-capabilities'}>
            Lister les couches disponibles
          </button>
        </div>
        {capabilities && (
          <div className={'mt-2'}>
            <div>
              Service WMS: {capabilities.Service.Title} {capabilities.version}
            </div>
            <div className={'mb-2'}>Couches disponibles : </div>
            <div className={'wms-layer-selector'}>
              {capabilities.Capability.Layer.Layer.map((lay, i) => (
                <WmsLayerItem key={`${lay.Name}-${i}`} layer={lay} selected={selectedLayer?.Name === lay.Name} onSelected={this.handleLayerSelected} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  private handleUrlChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    this.setState({ url: value }, () => {
      const wms = this.getDefinitionFromState();
      this.props.onChange(wms);
    });
  };

  private handleLayerSelected = (layer: WmsLayer) => {
    this.setState({ selectedLayer: layer }, () => {
      const wms = this.getDefinitionFromState();
      this.props.onChange(wms);
    });
  };

  private handleUsernameChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: ev.target.value }, () => {
      const wms = this.getDefinitionFromState();
      this.props.onChange(wms);
    });
  };

  private handlePasswordChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: ev.target.value }, () => {
      const wms = this.getDefinitionFromState();
      this.props.onChange(wms);
    });
  };

  private getCapabilities = () => {
    const { geo, toasts } = this.props.services;

    let auth: WmsAuthentication | undefined;
    if (this.state.username && this.state.password) {
      auth = { username: this.state.username, password: this.state.password };
    }

    geo
      .getWmsCapabilities(this.state.url, auth)
      .then((res) => {
        logger.debug('Capabilities: ', res);
        this.setState({ capabilities: res });
      })
      .catch((err) => {
        toasts.error("Impossible d'obtenir les capacités du serveur, vérifiez l'url");
        logger.error(err);
      });
  };

  private getDefinitionFromState(): WmsDefinition {
    const boundingBox: WmsBoundingBox | undefined = this.state.selectedLayer?.BoundingBox.length ? this.state.selectedLayer?.BoundingBox[0] : undefined;
    // FIXME: is this the good projection to choose ?
    const projection: AbcProjection | undefined = boundingBox ? { name: boundingBox.crs } : undefined;
    const extent = boundingBox?.extent;
    let auth: WmsAuthentication | undefined;
    if (this.state.username && this.state.password) {
      auth = {
        username: this.state.username,
        password: this.state.password,
      };
    }
    return {
      remoteUrl: this.state.url,
      remoteLayerName: this.state.selectedLayer?.Name || '',
      projection,
      extent,
      auth,
    };
  }
}

export default withServices(WmsSettingsPanel);
