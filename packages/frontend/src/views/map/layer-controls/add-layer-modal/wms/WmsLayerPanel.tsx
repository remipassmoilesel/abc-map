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
import { AbcProjection, BasicAuthentication, isProjectionEqual, Logger, normalizedProjectionName } from '@abc-map/shared';
import { WmsCapabilities, WmsLayer } from '../../../../../core/geo/WmsCapabilities';
import WmsLayerItem from './WmsLayerItem';
import { ServiceProps, withServices } from '../../../../../core/withServices';
import FormValidationLabel from '../../../../../components/form-validation-label/FormValidationLabel';
import { ValidationHelper } from '../../../../../core/utils/ValidationHelper';
import { FormState } from '../../../../../components/form-validation-label/FormState';
import { LayerFactory } from '../../../../../core/geo/layers/LayerFactory';
import { HistoryKey } from '../../../../../core/history/HistoryKey';
import { AddLayersChangeset } from '../../../../../core/history/changesets/layers/AddLayersChangeset';
import ControlButtons from '../_common/ControlButtons';
import { WmsSettings } from '../../../../../core/geo/layers/LayerFactory.types';
import { prefixedTranslation } from '../../../../../i18n/i18n';
import { withTranslation } from 'react-i18next';
import Cls from './WmsLayerPanel.module.scss';

const logger = Logger.get('WmsLayerPanel.tsx');

interface Props extends ServiceProps {
  projectProjection: AbcProjection;
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

const t = prefixedTranslation('MapView:AddLayerModal.');

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
    const protocolWarn = this.props.value.capabilitiesUrl?.toLocaleLowerCase().includes('wmts');

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
            data-cy={'wms-settings-url'}
          />
        </div>

        {/* Warning if URL seems to belong to use protocol */}
        {protocolWarn && <div className={`mb-3 ${Cls.warn}`}>{t('WMS_are_you_sure')}</div>}

        {/* Small advice */}
        <div className={'alert alert-info'}>
          {t('Sample_URL')}: <code>https://domain.service.fr/product/wms</code>
        </div>

        <div className={'d-flex flex-row mb-3'}>
          <input
            type={'text'}
            value={value?.auth?.username}
            onChange={this.handleUsernameChanged}
            className={'form-control mr-2'}
            placeholder={t('Username')}
            data-cy={'wms-settings-username'}
          />
          <input
            type={'password'}
            value={value?.auth?.password}
            onChange={this.handlePasswordChanged}
            className={'form-control'}
            placeholder={t('Password')}
            data-cy={'wms-settings-password'}
          />
        </div>

        <div className={'d-flex justify-content-end mb-3'}>
          <button onClick={this.fetchCapabilities} disabled={loading} data-cy={'wms-settings-capabilities'} className={'btn btn-primary ml-2'}>
            {t('List_available_layers')}
          </button>
        </div>

        {loading && <div className={'p-3 text-center'}>{t('Loading')}</div>}

        {capabilities && (
          <>
            <div className={'mb-2'}>{t('Select_layer')} : </div>
            <div className={Cls.wmsLayerSelector}>
              {layers.length < 1 && <div className={'p-3 text-center'}>{t('No_layer_available')}</div>}
              {layers.map((lay, i) => (
                <WmsLayerItem key={`${lay.Name}-${i}`} layer={lay} selected={value?.remoteLayerName === lay.Name} onSelected={this.handleLayerSelected} />
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

    const values: WmsSettings = {
      ...this.props.value,
      capabilitiesUrl: url,
    };

    const formState = this.validateForm(values);
    this.setState({ formState });
    this.props.onChange(values);
  };

  private handleLayerSelected = (layer: WmsLayer) => {
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

  private async getValues(layer: WmsLayer): Promise<WmsSettings> {
    const { geo } = this.props.services;
    const capabilities = this.state.capabilities;
    const projectProjection = this.props.projectProjection;

    // We grab layer name and WMS urls
    const remoteLayerName = layer.Name || '';
    const dcpTypes = capabilities?.Capability?.Request?.GetMap?.DCPType;
    const remoteUrls = dcpTypes?.map((dcpType) => dcpType.HTTP?.Get?.OnlineResource).filter((url) => typeof url === 'string' && !!url) as string[];
    if (!remoteLayerName || !remoteUrls || !remoteUrls.length) {
      return Promise.reject(new Error('Invalid layer name or URLs'));
    }

    // We try to the project projection, otherwise we use the first projection available
    let projectionName = layer.CRS?.find((crs) => isProjectionEqual(crs, projectProjection.name));
    if (!projectionName) {
      // FIXME: we should try to load projection in order to ensure we can use it
      projectionName = layer.CRS?.find((crs) => normalizedProjectionName(crs));
    }

    // We load projection if any
    if (projectionName) {
      await geo.loadProjection(projectionName);
    }

    return {
      ...this.props.value,
      remoteUrls,
      remoteLayerName,
      projection: projectionName ? { name: projectionName } : undefined,
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
    this.setState({ formState });
    this.props.onChange(values);
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

    geo
      .getWmsCapabilities(value.capabilitiesUrl, auth)
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
      const layer = LayerFactory.newWmsLayer(settings);

      const cs = new AddLayersChangeset(map, [layer]);
      await cs.apply();
      history.register(HistoryKey.Map, cs);

      map.setActiveLayer(layer);
      this.props.onConfirm();
    };

    add().catch((err) => logger.error('Cannot add layer', err));
  };

  private validateForm(value: WmsSettings): FormState {
    if (!ValidationHelper.url(value.capabilitiesUrl || '')) {
      return FormState.InvalidUrl;
    }

    if (!value.remoteLayerName) {
      return FormState.MissingRemoteLayer;
    }

    return FormState.Ok;
  }
}

export default withTranslation()(withServices(WmsLayerPanel));
