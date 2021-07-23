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

const logger = Logger.get('XYZSettingsPanel.tsx');

interface LocalProps {
  onChange: (xyzUrl: string) => void;
}

interface State {
  url: string;
  formState: FormState;
}

declare type Props = LocalProps & ServiceProps;

class XYZSettingsPanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      url: '',
      formState: FormState.InvalidUrl,
    };
  }

  public render(): ReactNode {
    const url = this.state.url;
    const formState = this.state.formState;
    return (
      <div>
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

        <FormValidationLabel state={formState} />
      </div>
    );
  }

  private handleUrlChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    const formState = this.validateForm(ev.target.value);
    this.setState({ url: value, formState }, () => {
      this.props.onChange(value);
    });
  };

  private validateForm(url: string): FormState {
    if (!ValidationHelper.url(url)) {
      return FormState.InvalidUrl;
    }

    return FormState.Ok;
  }
}

function variable(name: string) {
  return <code>&#123;{name}&#125;</code>;
}

export default withServices(XYZSettingsPanel);
