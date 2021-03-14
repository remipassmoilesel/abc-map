import React, { KeyboardEvent, ChangeEvent, Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-shared';
import Cls from './LoginForm.module.scss';

const logger = Logger.get('LoginForm.tsx', 'info');

interface State {
  email: string;
  password: string;
}

interface Props {
  onSubmit: (email: string, password: string) => void;
}

class LoginForm extends Component<Props, State> {
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
        <h3>Connexion</h3>
        <p>La connexion est facultative, elle permet de sauvegarder ses cartes en ligne et de les partager.</p>
        <p>Pour vous connecter, renseignez votre adresse email et votre mot de passe ci-dessous:</p>
        <div className={`form-group ${Cls.form}`}>
          <input
            type={'email'}
            value={this.state.email}
            onInput={this.handleLoginChange}
            onKeyUp={this.handleKeyUp}
            placeholder={'Adresse email'}
            className={'form-control'}
            data-cy={'login-email'}
          />
          <input
            type={'password'}
            value={this.state.password}
            onInput={this.handlePasswordChange}
            onKeyUp={this.handleKeyUp}
            placeholder={'Mot de passe'}
            className={'form-control'}
            data-cy={'login-password'}
          />
          <button type={'button'} onClick={this.handleSubmit} className={'btn btn-primary'} data-cy={'login-button'}>
            Connexion
          </button>
        </div>
      </div>
    );
  }

  private handleSubmit = () => this.props.onSubmit(this.state.email, this.state.password);

  private handleLoginChange = (ev: ChangeEvent<HTMLInputElement>) => this.setState({ email: ev.target.value });

  private handlePasswordChange = (ev: ChangeEvent<HTMLInputElement>) => this.setState({ password: ev.target.value });

  private handleKeyUp = (ev: KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      this.handleSubmit();
    }
  };
}

export default LoginForm;
