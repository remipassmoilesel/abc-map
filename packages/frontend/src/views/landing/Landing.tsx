import React, { ChangeEvent, Component, ReactNode } from 'react';
import { services } from '../../core/Services';
import { Logger } from '@abc-map/frontend-shared';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { FrontendRoutes } from '@abc-map/frontend-shared';
import { RegistrationStatus } from '@abc-map/shared-entities';
import './Landing.scss';

const logger = Logger.get('Landing.tsx', 'info');

interface State {
  loginEmail: string;
  loginPassword: string;
  registrationEmail: string;
  registrationPassword: string;
}

declare type Props = RouteComponentProps<any, any>;

class Landing extends Component<Props, State> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {
      loginEmail: '',
      loginPassword: '',
      registrationEmail: '',
      registrationPassword: '',
    };
  }

  public render(): ReactNode {
    return (
      <div className={'abc-landing'}>
        {/*Introduction*/}
        <h1>Bienvenue !</h1>
        <p>
          Abc-Map est un logiciel libre de cartographie.
          <br />
          Abc-Map vous permet de créer des cartes simplement, sans connaissances techniques.
        </p>
        <p>Pour créer votre première carte efficacement:</p>
        <ul>
          <li>
            Prenez le temps de consulter <Link to={FrontendRoutes.help()}>la page Aide</Link>
          </li>
          <li>
            Commencez à créer sur la page <Link to={FrontendRoutes.map()}>la page Carte</Link>, importez des données à partir de votre navigateur ou{' '}
            <Link to={FrontendRoutes.dataStore()}>sur la page Catalogue de données</Link>
          </li>
          <li>
            Mettez en page et exportez votre carte sur <Link to={FrontendRoutes.layout()}>la page Mise en page</Link>
          </li>
        </ul>
        <p>
          Si vous souhaitez en savoir plus sur ce logiciel, <Link to={FrontendRoutes.about()}>c&apos;est par ici.</Link>
        </p>

        {/*FIXME: extract authentication form and registration form as components*/}

        {/*Authentication*/}
        <h2>Connexion</h2>
        <p>La connexion est facultative, elle permet de sauvegarder ses cartes en ligne et de les partager.</p>
        <p>Pour vous connecter, renseignez votre adresse email et votre mot de passe ci-dessous:</p>
        <div className={'form-group login-form'}>
          <input
            type={'email'}
            value={this.state.loginEmail}
            onChange={this.onLoginEmailChanged}
            placeholder={'Adresse email'}
            className={'form-control'}
            data-cy={'login-email'}
          />
          <input
            type={'password'}
            value={this.state.loginPassword}
            onChange={this.onLoginPasswordChanged}
            placeholder={'Mot de passe'}
            className={'form-control'}
            data-cy={'login-password'}
          />
          <button type={'button'} onClick={this.authentication} className={'btn btn-primary'} data-cy={'login-button'}>
            Connexion
          </button>
        </div>

        {/*Registration*/}
        <h2>Inscription</h2>
        <p>Une fois inscrit, vous pouvez sauvegarder vos carte en ligne et les partager avec d&apos;autres utilisateurs.</p>
        <p>Vos informations personnelles et vos cartes ne seront jamais transmises à un tiers.</p>
        <div className={'form-group registration-form'}>
          <input
            type={'email'}
            value={this.state.registrationEmail}
            onChange={this.onRegistrationEmailChanged}
            placeholder={'Adresse email'}
            className={'form-control'}
            data-cy={'registration-email'}
          />
          <input
            type={'password'}
            value={this.state.registrationPassword}
            onChange={this.onRegistrationPasswordChanged}
            placeholder={'Mot de passe'}
            className={'form-control'}
            data-cy={'registration-password'}
          />
          <button type={'button'} onClick={this.registration} className={'btn btn-primary'} data-cy={'registration-submit'}>
            Inscription
          </button>
        </div>
      </div>
    );
  }

  private authentication = () => {
    if (!this.state.loginEmail || !this.state.loginPassword) {
      return this.services.toasts.info("Vous devez d'abord saisir votre email et votre mot de passe");
    }

    this.services.authentication
      .login(this.state.loginEmail, this.state.loginPassword)
      .then(() => {
        this.setState({ registrationEmail: '', registrationPassword: '' });
        return this.props.history.push(FrontendRoutes.map());
      })
      .catch((err) => logger.error(err));
  };

  private registration = () => {
    this.services.authentication
      .register(this.state.registrationEmail, this.state.registrationPassword)
      .then((res) => {
        if (res.status === RegistrationStatus.EmailAlreadyExists) {
          return this.services.toasts.info('Cette adresse email est déjà prise');
        }
        if (res.status === RegistrationStatus.Successful) {
          this.setState({ registrationEmail: '', registrationPassword: '' });
          return this.services.toasts.info('Un email vient de vous être envoyé, vous devez activer votre compte');
        }
        this.services.toasts.genericError();
      })
      .catch(() => this.services.toasts.genericError());
  };

  private onLoginEmailChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    this.setState({ loginEmail: ev.target.value });
  };

  private onLoginPasswordChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    this.setState({ loginPassword: ev.target.value });
  };

  private onRegistrationEmailChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    this.setState({ registrationEmail: ev.target.value });
  };

  private onRegistrationPasswordChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    this.setState({ registrationPassword: ev.target.value });
  };
}

export default withRouter(Landing);
