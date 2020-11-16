import React, { Component, ReactNode } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { FrontendRoutes } from '../FrontendRoutes';
import Home from './home/Home';
import Settings from './settings/Settings';
import { Provider } from 'react-redux';
import mainStore from '../store';

class App extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <Provider store={mainStore}>
        <BrowserRouter>
          <Switch>
            <Route exact path={FrontendRoutes.Home} component={Home} />
            <Route exact path={FrontendRoutes.Settings} component={Settings} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
