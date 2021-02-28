import React, { Component, ReactNode } from 'react';
import { Logger } from '../../core/utils/Logger';
import { FrontendRoutes, UserStatus } from '@abc-map/shared-entities';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { services } from '../../core/Services';
import { MainState } from '../../core/store/reducer';
import Cls from './TopBar.module.scss';
import TopBarLink from './TopBarLink';

const logger = Logger.get('TopBar.tsx', 'info');

const mapStateToProps = (state: MainState) => ({
  userStatus: state.authentication.userStatus,
  user: state.authentication.user,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & RouteComponentProps<any>;

interface State {
  linkActive: string;
}

class TopBar extends Component<Props, State> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {
      linkActive: FrontendRoutes.landing(),
    };
  }

  public render(): ReactNode {
    const userAuthenticated = this.props.userStatus === UserStatus.AUTHENTICATED;
    const user = this.props.user;
    const label = user && userAuthenticated ? user.email : 'Visiteur';

    return (
      <div className={Cls.topBar}>
        <h1>
          <Link to={FrontendRoutes.landing()}>
            <i className={'fa fa-map-marked-alt mr-2'} />
            Abc-Map
          </Link>
        </h1>

        <TopBarLink label={'Carte'} to={FrontendRoutes.map()} />
        <TopBarLink label={'Catalogue de données'} to={FrontendRoutes.dataStore()} />
        <TopBarLink label={'Mise en page'} to={FrontendRoutes.layout()} />
        <TopBarLink label={'Aide'} to={FrontendRoutes.help()} />
        <TopBarLink label={'A propos'} to={FrontendRoutes.about()} />

        <div className={'flex-grow-1'} />
        <div className={'ml-3'}>
          <Dropdown data-cy={'user-menu'}>
            <Dropdown.Toggle variant="light">
              <i className={'fa fa-user'} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.ItemText data-cy={'user-label'}>{label}</Dropdown.ItemText>
              {!userAuthenticated && <Dropdown.Item onClick={this.handleLogin}>Se connecter</Dropdown.Item>}
              <Dropdown.Item onClick={this.handleLogout} disabled={!userAuthenticated} data-cy={'logout'}>
                <i className={'fa fa-lock mr-2'} /> Se déconnecter
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    );
  }

  private handleLogin = () => {
    this.props.history.push(FrontendRoutes.landing());
  };

  private handleLogout = () => {
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
