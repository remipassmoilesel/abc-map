import React, { Component, ReactNode } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { FrontendRoutes } from '@abc-map/shared-entities';
import MapView from './views/map-view/MapView';
import Settings from './views/settings/Settings';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import Landing from './views/landing/Landing';
import LayoutView from './views/layout/LayoutView';
import TopBar from './components/top-bar/TopBar';
import DataStore from './views/datastore/DataStore';
import NotFound from './views/not-found/NotFound';
import Help from './views/help/Help';
import About from './views/about/About';
import { services } from './core/Services';
import ConfirmAccount from './views/confirm-account/ConfirmAccount';
import { Env } from './core/utils/Env';
import { mainStore } from './core/store/store';
import RenameModal from './components/rename-modal/RenameModal';
import PasswordModal from './components/password-modal/PasswordModal';
import DeviceWarningModal from './components/device-warning-modal/DeviceWarningModal';

class App extends Component<{}, {}> {
  private services = services();

  public render(): ReactNode {
    return (
      <Provider store={mainStore}>
        <BrowserRouter>
          <TopBar />
          <Switch>
            <Route exact path={FrontendRoutes.landing()} component={Landing} />
            <Route exact path={FrontendRoutes.map()} component={MapView} />
            <Route exact path={FrontendRoutes.dataStore()} component={DataStore} />
            <Route exact path={FrontendRoutes.layout()} component={LayoutView} />
            <Route exact path={FrontendRoutes.settings()} component={Settings} />
            <Route exact path={FrontendRoutes.help()} component={Help} />
            <Route exact path={FrontendRoutes.about()} component={About} />
            <Route exact path={FrontendRoutes.confirmAccount()} component={ConfirmAccount} />
            <Route path={'*'} component={NotFound} />
          </Switch>
          <ToastContainer className={'toast-container'} />
          <RenameModal />
          <PasswordModal />
          <DeviceWarningModal />
        </BrowserRouter>
      </Provider>
    );
  }

  public componentDidMount() {
    if (!Env.isE2e()) {
      window.addEventListener('beforeunload', this.warnBeforeUnload);
      window.addEventListener('unload', this.warnBeforeUnload);
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('beforeunload', this.warnBeforeUnload);
    window.removeEventListener('unload', this.warnBeforeUnload);
  }

  /**
   * Display warning if tab reload or is closing, in order to prevent modifications loss
   * @param ev
   * @private
   */
  private warnBeforeUnload = (ev: BeforeUnloadEvent | undefined): string => {
    const message = 'Les modifications seront perdues, êtes vous sûr ?';
    if (ev) {
      ev.returnValue = message;
    }
    return message;
  };
}

export default App;
