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
import { ServiceProps, withServices } from '../../../../../core/withServices';
import FormValidationLabel from '../../../../../components/form-validation-label/FormValidationLabel';
import { ValidationHelper } from '../../../../../core/utils/ValidationHelper';
import { FormState } from '../../../../../components/form-validation-label/FormState';
import ControlButtons from '../_common/ControlButtons';
import { LayerFactory } from '../../../../../core/geo/layers/LayerFactory';
import { HistoryKey } from '../../../../../core/history/HistoryKey';
import { AddLayersTask } from '../../../../../core/history/tasks/layers/AddLayersTask';

const logger = Logger.get('XYZLayerPanel.tsx');

interface LocalProps {
  value: string;
  onChange: (xyzUrl: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

interface State {
  formState: FormState;
}

declare type Props = LocalProps & ServiceProps;

class XYZLayerPanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { formState: FormState.InvalidUrl };
  }

  public render(): ReactNode {
    const url = this.props.value;
    const formState = this.state.formState;
    const onCancel = this.props.onCancel;
    const submitDisabled = formState !== FormState.Ok;

    return (
      <div className={'flex-grow-1 d-flex flex-column justify-content-between'}>
        {/* Url form */}
        <div className={'d-flex flex-column'}>
          <input
            type={'text'}
            value={url}
            onChange={this.handleUrlChanged}
            className={'form-control mb-3'}
            placeholder={'URL (obligatoire)'}
            data-cy={'xyz-settings-url'}
          />
          <div className={'alert alert-info'}>
            L&apos;URL doit contenir les variables {variable('x')}, {variable('y')} et {variable('z')}. <br />
            Exemple:&nbsp;
            <code>
              http://my-domain.net/{variable('x')}/{variable('y')}/{variable('z')}
            </code>
          </div>
        </div>

        {/* Form validation */}
        <FormValidationLabel state={formState} />

        {/* Control buttons */}
        <ControlButtons submitDisabled={submitDisabled} onCancel={onCancel} onConfirm={this.handleConfirm} />
      </div>
    );
  }

  public componentDidMount() {
    // We validate form on mount, in case of a pre exising state
    const formState = this.validateForm(this.props.value);
    this.setState({ formState });
  }

  private handleConfirm = () => {
    const { history, geo } = this.props.services;

    const map = geo.getMainMap();
    const layer = LayerFactory.newXyzLayer(this.props.value);
    map.addLayer(layer);
    map.setActiveLayer(layer);
    history.register(HistoryKey.Map, new AddLayersTask(map, [layer]));

    this.props.onConfirm();
  };

  private handleUrlChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;

    const formState = this.validateForm(value);
    this.setState({ formState }, () => this.props.onChange(value));
  };

  private validateForm(url: string): FormState {
    if (!ValidationHelper.url(url)) {
      return FormState.InvalidUrl;
    }

    if (!ValidationHelper.xyzUrl(url)) {
      return FormState.MissingXYZPlaceHolders;
    }

    return FormState.Ok;
  }
}

function variable(name: string) {
  return <code>&#123;{name}&#125;</code>;
}

export default withServices(XYZLayerPanel);
