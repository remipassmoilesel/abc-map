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

import React, { KeyboardEvent, ChangeEvent, Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-commons';
import Cls from './RegistrationForm.module.scss';

const logger = Logger.get('RegistrationForm.tsx', 'info');

interface State {
  email: string;
  password: string;
}

interface Props {
  onSubmit: (email: string, password: string) => void;
}

class RegistrationForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  public render(): ReactNode {
    return (
      <div className={'mt-4'}>
        <h3>Inscription</h3>
        <p>Une fois inscrit, vous pouvez sauvegarder vos carte en ligne et les partager avec d&apos;autres utilisateurs.</p>
        <p>Vos informations personnelles et vos cartes ne seront jamais transmises à un tiers.</p>
        <div className={`form-group ${Cls.form}`}>
          <input
            type={'email'}
            value={this.state.email}
            onChange={this.handleEmailChange}
            onKeyUp={this.handleKeyUp}
            placeholder={'Adresse email'}
            className={'form-control'}
            data-cy={'registration-email'}
          />
          <input
            type={'password'}
            value={this.state.password}
            onChange={this.handlePasswordChange}
            onKeyUp={this.handleKeyUp}
            placeholder={'Mot de passe'}
            className={'form-control'}
            data-cy={'registration-password'}
          />
          <button type={'button'} onClick={this.handleSubmit} className={'btn btn-primary'} data-cy={'registration-submit'}>
            Inscription
          </button>
        </div>
      </div>
    );
  }

  private handleSubmit = () => this.props.onSubmit(this.state.email, this.state.password);

  private handleEmailChange = (ev: ChangeEvent<HTMLInputElement>) => this.setState({ email: ev.target.value });

  private handlePasswordChange = (ev: ChangeEvent<HTMLInputElement>) => this.setState({ password: ev.target.value });

  private handleKeyUp = (ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      this.handleSubmit();
    }
  };
}

export default RegistrationForm;
