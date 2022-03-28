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

import Cls from './App.module.scss';
import React, { lazy, useEffect, Suspense } from 'react';
import { matchPath, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { getAbcWindow } from '@abc-map/shared';
import { ToastContainer } from 'react-toastify';
import TopBar from './components/top-bar/TopBar';
import PasswordInputModal from './components/password-input-modal/PasswordInputModal';
import DeviceWarningModal from './components/device-warning-modal/DeviceWarningModal';
import EditPropertiesModal from './components/edit-properties-modal/EditPropertiesModal';
import SolicitationModal from './components/solicitation-modal/SolicitationModal';
import LoginModal from './components/login-modal/LoginModal';
import RegistrationModal from './components/registration-modal/RegistrationModal';
import PasswordLostModal from './components/password-lost-modal/PasswordLostModal';
import SetPasswordModal from './components/set-password-modal/SetPasswordModal';
import LongOperationModal from './components/long-operation-modal/LongOperationModal';
import ConfirmationModal from './components/confirmation-modal/ConfirmationModal';
import { withTranslation } from 'react-i18next';
import FeedbackPopup from './components/feedback/FeedbackPopup';
import FeedbackModal from './components/feedback/FeedbackModal';
import { Routes } from './routes';
import { WarningBeforeUnload } from './components/warning-before-unload/WarningBeforeUnload';
import { TokenWatcher } from './components/token-watcher/TokenWatcher';
import PromptVariablesModal from './components/prompt-variables-modal/PromptVariablesModal';
import { BlueLoader } from './components/blue-loader/BlueLoader';
import clsx from 'clsx';

// App views, all lazy loaded
const LandingView = lazy(() => import('./views/landing/LandingView'));
const ExportView = lazy(() => import('./views/export/ExportView'));
const DataStoreView = lazy(() => import('./views/datastore/DataStoreView'));
const NotFoundView = lazy(() => import('./views/not-found/NotFoundView'));
const ConfirmAccountView = lazy(() => import('./views/confirm-account/ConfirmAccountView'));
const DataProcessingView = lazy(() => import('./views/data-processing/DataProcessingView'));
const ResetPasswordView = lazy(() => import('./views/reset-password/ResetPasswordView'));
const MapView = lazy(() => import('./views/map/MapView'));
const UserAccountView = lazy(() => import('./views/user-account/UserAccountView'));
const LegalMentionsView = lazy(() => import('./views/legal-mentions/LegalMentionsView'));
const FundingView = lazy(() => import('./views/funding/FundingView'));
const SharedMapView = lazy(() => import('./views/shared-map/SharedMapView'));
const SharedMapSettingsView = lazy(() => import('./views/shared-map-settings/SharedMapSettingsView'));
const DocumentationView = lazy(() => import('./views/documentation/DocumentationView'));

const fullscreenRoutes = [Routes.sharedMap().raw()];

export function App() {
  const history = useHistory();
  const location = useLocation();
  const fullscreenView = !fullscreenRoutes.find((r) => matchPath(location.pathname, { path: r }));

  useEffect(() => {
    // This route is used in documentation
    getAbcWindow().abc.goToFunding = () => history.push(Routes.funding().format());
  }, [history]);

  return (
    <>
      {/* Edition: with top bar, most of views are enabled */}
      {fullscreenView && (
        <>
          <TopBar />

          <div className={clsx(Cls.appViewport, 'abc-app-viewport')}>
            <Suspense fallback={fallbackUi()}>
              <Switch>
                <Route exact path={'/'} component={LandingView} />
                <Route exact path={Routes.landing().raw()} component={LandingView} />
                <Route exact path={Routes.map().raw()} component={MapView} />
                <Route exact path={Routes.dataStore().raw()} component={DataStoreView} />
                <Route exact path={Routes.shareSettings().raw()} component={SharedMapSettingsView} />
                <Route exact path={Routes.export().raw()} component={ExportView} />
                <Route exact path={Routes.documentation().raw()} component={DocumentationView} />
                <Route exact path={Routes.confirmAccount().raw()} component={ConfirmAccountView} />
                <Route exact path={Routes.dataProcessing().raw()} component={DataProcessingView} />
                <Route exact path={Routes.resetPassword().raw()} component={ResetPasswordView} />
                <Route exact path={Routes.userAccount().raw()} component={UserAccountView} />
                <Route exact path={Routes.legalMentions().raw()} component={LegalMentionsView} />
                <Route exact path={Routes.funding().raw()} component={FundingView} />
                <Route path={'*'} component={NotFoundView} />
              </Switch>
            </Suspense>
          </div>

          <ConfirmationModal />
          <DeviceWarningModal />
          <EditPropertiesModal />
          <FeedbackModal />
          <FeedbackPopup />
          <LoginModal />
          <LongOperationModal />
          <PasswordInputModal />
          <PasswordLostModal />
          <RegistrationModal />
          <SetPasswordModal />
          <SolicitationModal />
          <WarningBeforeUnload />
          <PromptVariablesModal />
        </>
      )}

      {/* Map share, fullscreen */}
      {!fullscreenView && (
        <>
          <div className={clsx(Cls.appViewport, 'abc-app-viewport')}>
            <Suspense fallback={fallbackUi()}>
              <Switch>
                <Route exact path={Routes.sharedMap().raw()} component={SharedMapView} />
                <Route path={'*'} component={NotFoundView} />
              </Switch>
            </Suspense>
          </div>
        </>
      )}

      {/* Common components */}
      <ToastContainer className={'abc-toast-container'} />
      <TokenWatcher />
    </>
  );
}

function fallbackUi() {
  return (
    <div className={Cls.suspense}>
      <BlueLoader />
    </div>
  );
}

export default withTranslation()(App);
