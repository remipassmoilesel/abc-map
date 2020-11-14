import React, { Component, ReactNode } from 'react';
import './App.scss';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { FrontendRoutes } from '../FrontendRoutes';
import Home from './home/Home';
import Settings from './settings/Settings';

class App extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path={FrontendRoutes.Home} component={Home} />
          <Route exact path={FrontendRoutes.Settings} component={Settings} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
