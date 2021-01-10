import React, { Component, ReactNode } from 'react';
import { Logger } from '../../core/utils/Logger';
import { FrontendRoutes, UserStatus } from '@abc-map/shared-entities';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { services } from '../../core/Services';
import { MainState } from '../../core/store/reducer';
import './TopBar.scss';

const logger = Logger.get('TopBar.tsx', 'info');

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LocalProps {}

const mapStateToProps = (state: MainState) => ({
  userStatus: state.authentication.userStatus,
  user: state.authentication.user,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & LocalProps & RouteComponentProps<any>;

class TopBar extends Component<Props, {}> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const userAuthenticated = this.props.userStatus === UserStatus.AUTHENTICATED;
    const user = this.props.user;
    const label = user && userAuthenticated ? user.email : 'Visiteur';

    return (
      <div className={'abc-top-bar'}>
        <h1>
          <Link to={FrontendRoutes.landing()}>
            <i className={'fa fa-map-marked-alt mr-2'} />
            Abc-Map
          </Link>
        </h1>
        <Link to={FrontendRoutes.map()} className={'link'}>
          Carte
        </Link>
        <Link to={FrontendRoutes.dataStore()} className={'link'}>
          Catalogue de données
        </Link>
        <Link to={FrontendRoutes.layout()} className={'link'}>
          Mise en page
        </Link>
        <Link to={FrontendRoutes.settings()} className={'link'}>
          Paramètres
        </Link>
        <Link to={FrontendRoutes.help()} className={'link'}>
          Aide
        </Link>
        <Link to={FrontendRoutes.about()} className={'link'}>
          A propos
        </Link>
        <div className={'flex-grow-1'} />
        <div className={'ml-3'}>
          <Dropdown data-cy={'user-menu'}>
            <Dropdown.Toggle variant="light">
              <i className={'fa fa-user'} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.ItemText data-cy={'user-label'}>{label}</Dropdown.ItemText>
              {!userAuthenticated && <Dropdown.Item onClick={this.login}>Se connecter</Dropdown.Item>}
              <Dropdown.Item onClick={this.logout} disabled={!userAuthenticated} data-cy={'logout'}>
                <i className={'fa fa-lock mr-2'} /> Se déconnecter
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    );
  }

  private login = () => {
    this.props.history.push(FrontendRoutes.landing());
  };

  private logout = () => {
    this.services.project.newProject();
    this.services.authentication
      .logout()
      .then(() => {
        this.services.ui.toasts.info("Vous n'êtes plus connecté !");
      })
      .catch((err) => {
        this.services.ui.toasts.genericError();
        logger.error(err);
      });
  };
}

export default connector(withRouter(TopBar));
