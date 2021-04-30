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

import React, { Component, ReactNode } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { FrontendRoutes } from '@abc-map/frontend-commons';
import MapView from './views/map/MapView';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import LandingView from './views/landing/LandingView';
import LayoutView from './views/layout/LayoutView';
import TopBar from './components/top-bar/TopBar';
import DataStoreView from './views/datastore/DataStoreView';
import NotFoundView from './views/not-found/NotFoundView';
import DocumentationView from './views/documentation/DocumentationView';
import ConfirmAccountView from './views/confirm-account/ConfirmAccountView';
import { Env } from './core/utils/Env';
import { mainStore } from './core/store/store';
import RenameModal from './components/rename-modal/RenameModal';
import PasswordModal from './components/password-modal/PasswordModal';
import DeviceWarningModal from './components/device-warning-modal/DeviceWarningModal';
import { ServiceProps, withServices } from './core/withServices';
import DataProcessingView from './views/data-processing/DataProcessingView';
import EditPropertiesModal from './components/edit-properties-modal/EditPropertiesModal';
import SolicitationModal from './components/solicitation-modal/SolicitationModal';

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
            <Route exact path={FrontendRoutes.documentation()} component={DocumentationView} />
            <Route exact path={FrontendRoutes.confirmAccount()} component={ConfirmAccountView} />
            <Route exact path={FrontendRoutes.dataProcessing()} component={DataProcessingView} />
            <Route path={'*'} component={NotFoundView} />
          </Switch>
          <ToastContainer className={'toast-container'} />
          <RenameModal />
          <PasswordModal />
          <DeviceWarningModal />
          <EditPropertiesModal />
          <SolicitationModal />
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
