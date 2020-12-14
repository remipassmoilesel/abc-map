import React, { Component, ReactNode } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { FrontendRoutes } from './FrontendRoutes';
import MapView from './views/map-view/MapView';
import Settings from './views/settings/Settings';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import mainStore from './core/store';
import Landing from './views/landing/Landing';
import Layout from './views/layout/Layout';
import TopBar from './components/top-bar/TopBar';
import DataStore from './views/datastore/DataStore';
import NotFound from './views/not-found/NotFound';
import Help from './views/help/Help';

class App extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <Provider store={mainStore}>
        <BrowserRouter>
          <TopBar />
          <Switch>
            <Route exact path={FrontendRoutes.Landing} component={Landing} />
            <Route exact path={FrontendRoutes.Map} component={MapView} />
            <Route exact path={FrontendRoutes.DataStore} component={DataStore} />
            <Route exact path={FrontendRoutes.Layout} component={Layout} />
            <Route exact path={FrontendRoutes.Settings} component={Settings} />
            <Route exact path={FrontendRoutes.Help} component={Help} />
            <Route path={'*'} component={NotFound} />
          </Switch>
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    );
  }

  public componentDidMount() {
    window.addEventListener('beforeunload', this.warnBeforeUnload);
    window.addEventListener('unload', this.warnBeforeUnload);
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
