import React, { ChangeEvent, Component, ReactNode } from 'react';
import { services } from '../../../../../core/Services';
import { Logger } from '../../../../../core/utils/Logger';
import { WmsBoundingBox, WmsCapabilities, WmsLayer } from '../../../../../core/geo/WmsCapabilities';
import WmsLayerItem from './WmsLayerItem';
import { AbcProjection, WmsAuthentication, WmsDefinition } from '@abc-map/shared-entities';
import './WmsSettingsPanel.scss';

const logger = Logger.get('WmsSettingsPanel.tsx', 'debug');

interface Props {
  onChange: (wms: WmsDefinition) => void;
}

interface State {
  url: string;
  capabilities?: WmsCapabilities;
  selectedLayer?: WmsLayer;
  username: string;
  password: string;
}

class WmsSettingsPanel extends Component<Props, State> {
  private services = services();

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
    let auth: WmsAuthentication | undefined;
    if (this.state.username && this.state.password) {
      auth = { username: this.state.username, password: this.state.password };
    }

    this.services.geo
      .getWmsCapabilities(this.state.url, auth)
      .then((res) => {
        logger.debug('Capabilities: ', res);
        this.setState({ capabilities: res });
      })
      .catch((err) => {
        this.services.ui.toasts.error("Impossible d'obtenir les capacités du serveur, vérifiez l'url");
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
      url: this.state.url,
      layerName: this.state.selectedLayer?.Name || '',
      projection,
      extent,
      auth,
    };
  }
}

export default WmsSettingsPanel;
