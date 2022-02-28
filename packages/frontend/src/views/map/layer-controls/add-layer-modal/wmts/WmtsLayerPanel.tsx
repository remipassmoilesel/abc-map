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
import { BasicAuthentication, Logger, normalizedProjectionName } from '@abc-map/shared';
import WmtsLayerItem from './WmtsLayerItem';
import { ServiceProps, withServices } from '../../../../../core/withServices';
import FormValidationLabel from '../../../../../components/form-validation-label/FormValidationLabel';
import { ValidationHelper } from '../../../../../core/utils/ValidationHelper';
import { FormState } from '../../../../../components/form-validation-label/FormState';
import { HistoryKey } from '../../../../../core/history/HistoryKey';
import { AddLayersChangeset } from '../../../../../core/history/changesets/layers/AddLayersChangeset';
import ControlButtons from '../_common/ControlButtons';
import { WmtsCapabilities, WmtsLayer } from '../../../../../core/geo/WmtsCapabilities';
import { WmtsSettings } from '../../../../../core/geo/layers/LayerFactory.types';
import { LayerFactory } from '../../../../../core/geo/layers/LayerFactory';
import { prefixedTranslation } from '../../../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './WmtsLayerPanel.module.scss';
import { resolveInAtLeast } from '../../../../../core/utils/resolveInAtLeast';
import { Projection } from 'ol/proj';

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

const t = prefixedTranslation('MapView:AddLayerModal.');

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
            placeholder={t('URL')}
            className={'form-control mb-3'}
            value={value?.capabilitiesUrl}
            onChange={this.handleUrlChanged}
            data-cy={'wmts-settings-url'}
          />
        </div>

        {/* Warning if URL seems to belong to use protocol */}
        {protocolWarn && <div className={`mb-3 ${Cls.warn}`}>{t('WMTS_are_you_sure')}</div>}

        {/* Small advice */}
        <div className={'alert alert-info'}>
          {t('Sample_URL')}: <code>https://domain.service.fr/product/wmts</code>
        </div>

        <div className={'d-flex flex-row mb-3'}>
          <input
            type={'text'}
            value={value?.auth?.username}
            onChange={this.handleUsernameChanged}
            className={'form-control mr-2'}
            placeholder={t('Username')}
            data-cy={'wmts-settings-username'}
          />
          <input
            type={'password'}
            value={value?.auth?.password}
            onChange={this.handlePasswordChanged}
            className={'form-control'}
            placeholder={t('Password')}
            data-cy={'wmts-settings-password'}
          />
        </div>

        {/* Capabilities and layers selection */}
        <div className={'d-flex justify-content-end mb-3'}>
          <button onClick={this.fetchCapabilities} disabled={loading} data-cy={'wmts-settings-capabilities'} className={'btn btn-primary ml-2'}>
            {t('List_available_layers')}
          </button>
        </div>

        {loading && <div className={'p-3 text-center'}>{t('Loading')}</div>}

        {capabilities && (
          <>
            <div className={'mb-2'}>{t('Select_layer')} : </div>
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

        <div className={'flex-grow-1'} />

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
    this.setState({ formState });
    this.props.onChange(values);
  };

  private handleLayerSelected = (layer: WmtsLayer) => {
    const { toasts } = this.props.services;

    this.getValues(layer)
      .then((values) => {
        const formState = this.validateForm(values);
        this.setState({ formState });
        this.props.onChange(values);
      })
      .catch((err) => {
        logger.error('Cannot use layer: ', err);
        toasts.error(t('Cannot_use_layer'));
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

    // We load projection if needed
    let projection: string | undefined;
    if (options.projection && options.projection instanceof Projection) {
      projection = normalizedProjectionName(options.projection.getCode());
    } else if (options.projection && typeof options.projection === 'string') {
      projection = normalizedProjectionName(options.projection);
    }
    if (projection) {
      // FIXME: we should try to load and try others options on fail
      await geo.loadProjection(projection);
    }

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
    this.setState({ formState });
    this.props.onChange(values);
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
    this.setState({ formState });
    this.props.onChange(values);
  };

  private fetchCapabilities = () => {
    const { geo, toasts } = this.props.services;
    const value = this.props.value;

    if (!value.capabilitiesUrl) {
      toasts.error(t('URL_is_mandatory'));
      return;
    }

    this.setState({ loading: true, capabilities: undefined });

    let auth: BasicAuthentication | undefined;
    if (value.auth?.username && value.auth?.password) {
      auth = { username: value.auth.username, password: value.auth.password };
    }

    resolveInAtLeast(geo.getWmtsCapabilities(value.capabilitiesUrl, auth), 600)
      .then((capabilities) => this.setState({ capabilities }))
      .catch((err) => {
        toasts.error(t('Cannot_get_capacities'));
        logger.error(err);
      })
      .finally(() => this.setState({ loading: false }));
  };

  private handleConfirm = () => {
    const { history, geo } = this.props.services;
    const { value: settings } = this.props;

    const add = async () => {
      const map = geo.getMainMap();
      const layer = LayerFactory.newWmtsLayer(settings);

      const cs = new AddLayersChangeset(map, [layer]);
      await cs.apply();
      history.register(HistoryKey.Map, cs);

      map.setActiveLayer(layer);
      this.props.onConfirm();
    };

    add().catch((err) => logger.error('Cannot add layer', err));
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

export default withTranslation()(withServices(WmtsLayerPanel));
