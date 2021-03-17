import React, { Component, ReactNode } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { FrontendRoutes } from '@abc-map/frontend-shared';
import MapView from './views/map/MapView';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import LandingView from './views/landing/LandingView';
import LayoutView from './views/layout/LayoutView';
import TopBar from './components/top-bar/TopBar';
import DataStoreView from './views/datastore/DataStoreView';
import NotFoundView from './views/not-found/NotFoundView';
import HelpView from './views/help/HelpView';
import AboutView from './views/about/AboutView';
import ConfirmAccountView from './views/confirm-account/ConfirmAccountView';
import { Env } from './core/utils/Env';
import { mainStore } from './core/store/store';
import RenameModal from './components/rename-modal/RenameModal';
import PasswordModal from './components/password-modal/PasswordModal';
import DeviceWarningModal from './components/device-warning-modal/DeviceWarningModal';
import MessageBanner from './components/message-banner/MessageBanner';
import { ServiceProps, withServices } from './core/withServices';

class App extends Component<ServiceProps, {}> {
  public render(): ReactNode {
    return (
      <Provider store={mainStore}>
        <BrowserRouter>
          <TopBar />
          <Switch>
            <Route exact path={FrontendRoutes.landing()} component={LandingView} />
            <Route exact path={FrontendRoutes.map()} component={MapView} />
            <Route exact path={FrontendRoutes.dataStore()} component={DataStoreView} />
            <Route exact path={FrontendRoutes.layout()} component={LayoutView} />
            <Route exact path={FrontendRoutes.help()} component={HelpView} />
            <Route exact path={FrontendRoutes.about()} component={AboutView} />
            <Route exact path={FrontendRoutes.confirmAccount()} component={ConfirmAccountView} />
            <Route path={'*'} component={NotFoundView} />
          </Switch>
          <MessageBanner />
          <ToastContainer className={'toast-container'} />
          <RenameModal />
          <PasswordModal />
          <DeviceWarningModal />
        </BrowserRouter>
      </Provider>
    );
  }

  public componentDidMount() {
    const { authentication } = this.props.services;

    if (!Env.isE2e()) {
      window.addEventListener('beforeunload', this.warnBeforeUnload);
      window.addEventListener('unload', this.warnBeforeUnload);
      authentication.watchToken();
    }
  }

  public componentWillUnmount() {
    const { authentication } = this.props.services;

    if (!Env.isE2e()) {
      window.removeEventListener('beforeunload', this.warnBeforeUnload);
      window.removeEventListener('unload', this.warnBeforeUnload);
      authentication.unwatchToken();
    }
  }

  /**
   * Display warning if tab reload or is closing, in order to prevent modifications loss
   * @param ev
   * @private
   */
  private warnBeforeUnload = (ev: BeforeUnloadEvent | undefined): string => {
    const message = 'Les modifications en cours seront perdues, êtes vous sûr ?';
    if (ev) {
      ev.returnValue = message;
    }
    return message;
  };
}

export default withServices(App);
