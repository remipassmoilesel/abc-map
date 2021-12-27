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
import { Route, Switch, useHistory } from 'react-router-dom';
import { getAbcWindow } from '@abc-map/shared';
import MapView from './views/map/MapView';
import { ToastContainer } from 'react-toastify';
import LandingView from './views/landing/LandingView';
import LayoutView from './views/layout/LayoutView';
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
import { Routes } from './routes';
import { TokenWatcher } from './components/token-watcher/TokenWatcher';
import FeedbackPopup from './components/feedback/FeedbackPopup';
import FeedbackModal from './components/feedback/FeedbackModal';

function App() {
  const history = useHistory();

  useEffect(() => {
    // This route is used in documentation
    getAbcWindow().abc.goToFunding = () => history.push(Routes.funding().format());
  }, [history]);

  return (
    <>
      {/* Top bar and main view */}
      <TopBar />

      <Switch>
        <Route exact path={'/'} component={LandingView} />
        <Route exact path={Routes.landing().raw()} component={LandingView} />
        <Route exact path={Routes.map().raw()} component={MapView} />
        <Route exact path={Routes.dataStore().raw()} component={DataStoreView} />
        <Route exact path={Routes.layout().raw()} component={LayoutView} />
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
      <ToastContainer className={'abc-toast-container'} />
      <TokenWatcher />

      {/* Modals */}
      <FeedbackPopup />
      <FeedbackModal />
      <PasswordInputModal />
      <SetPasswordModal />
      <DeviceWarningModal />
      <EditPropertiesModal />
      <SolicitationModal />
      <LoginModal />
      <RegistrationModal />
      <PasswordLostModal />
      <LegendSymbolPickerModal />
      <LongOperationModal />
      <ConfirmationModal />
    </>
  );
}

export default withTranslation()(App);
