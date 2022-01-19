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

import React, { useEffect } from 'react';
import { matchPath, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { getAbcWindow } from '@abc-map/shared';
import MapView from './views/map/MapView';
import { ToastContainer } from 'react-toastify';
import LandingView from './views/landing/LandingView';
import ExportView from './views/export/ExportView';
import TopBar from './components/top-bar/TopBar';
import DataStoreView from './views/datastore/DataStoreView';
import NotFoundView from './views/not-found/NotFoundView';
import DocumentationView from './views/documentation/DocumentationView';
import ConfirmAccountView from './views/confirm-account/ConfirmAccountView';
import PasswordInputModal from './components/password-input-modal/PasswordInputModal';
import DeviceWarningModal from './components/device-warning-modal/DeviceWarningModal';
import DataProcessingView from './views/data-processing/DataProcessingView';
import EditPropertiesModal from './components/edit-properties-modal/EditPropertiesModal';
import SolicitationModal from './components/solicitation-modal/SolicitationModal';
import LoginModal from './components/login-modal/LoginModal';
import RegistrationModal from './components/registration-modal/RegistrationModal';
import PasswordLostModal from './components/password-lost-modal/PasswordLostModal';
import ResetPasswordView from './views/reset-password/ResetPasswordView';
import UserAccountView from './views/user-account/UserAccountView';
import SetPasswordModal from './components/set-password-modal/SetPasswordModal';
import MapLegendView from './views/map-legend/MapLegendView';
import LegendSymbolPickerModal from './components/legend-symbol-picker-modal/LegendSymbolPickerModal';
import LegalMentionsView from './views/legal-mentions/LegalMentionsView';
import LongOperationModal from './components/long-operation-modal/LongOperationModal';
import FundingView from './views/funding/FundingView';
import ConfirmationModal from './components/confirmation-modal/ConfirmationModal';
import { withTranslation } from 'react-i18next';
import FeedbackPopup from './components/feedback/FeedbackPopup';
import FeedbackModal from './components/feedback/FeedbackModal';
import { Routes } from './routes';
import ShareSettingsView from './views/share-settings/ShareSettingsView';
import { WarningBeforeUnload } from './components/warning-before-unload/WarningBeforeUnload';
import { TokenWatcher } from './components/token-watcher/TokenWatcher';
import { SharedMapView } from './views/shared-map/SharedMapView';
import Cls from './App.module.scss';

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

          <div className={Cls.appViewport}>
            <Switch>
              <Route exact path={'/'} component={LandingView} />
              <Route exact path={Routes.landing().raw()} component={LandingView} />
              <Route exact path={Routes.map().raw()} component={MapView} />
              <Route exact path={Routes.dataStore().raw()} component={DataStoreView} />
              <Route exact path={Routes.shareSettings().raw()} component={ShareSettingsView} />
              <Route exact path={Routes.export().raw()} component={ExportView} />
              <Route exact path={Routes.mapLegend().raw()} component={MapLegendView} />
              <Route exact path={Routes.documentation().raw()} component={DocumentationView} />
              <Route exact path={Routes.confirmAccount().raw()} component={ConfirmAccountView} />
              <Route exact path={Routes.dataProcessing().raw()} component={DataProcessingView} />
              <Route exact path={Routes.resetPassword().raw()} component={ResetPasswordView} />
              <Route exact path={Routes.userAccount().raw()} component={UserAccountView} />
              <Route exact path={Routes.legalMentions().raw()} component={LegalMentionsView} />
              <Route exact path={Routes.funding().raw()} component={FundingView} />
              <Route path={'*'} component={NotFoundView} />
            </Switch>
          </div>

          <ConfirmationModal />
          <DeviceWarningModal />
          <EditPropertiesModal />
          <FeedbackModal />
          <FeedbackPopup />
          <LegendSymbolPickerModal />
          <LoginModal />
          <LongOperationModal />
          <PasswordInputModal />
          <PasswordLostModal />
          <RegistrationModal />
          <SetPasswordModal />
          <SolicitationModal />
          <WarningBeforeUnload />
        </>
      )}

      {/* Map share, fullscreen */}
      {!fullscreenView && (
        <>
          <Switch>
            <Route exact path={Routes.sharedMap().raw()} component={SharedMapView} />
            <Route path={'*'} component={NotFoundView} />
          </Switch>
        </>
      )}

      {/* Common components */}
      <ToastContainer className={'abc-toast-container'} />
      <TokenWatcher />
    </>
  );
}

export default withTranslation()(App);
