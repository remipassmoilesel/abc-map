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
import React, { lazy, Suspense } from 'react';
import { Route, Routes as RoutesContainer } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import TopBar from './components/top-bar/TopBar';
import PasswordInputModal from './components/password-input-modal/PasswordInputModal';
import DeviceWarningModal from './components/device-warning-modal/DeviceWarningModal';
import { EditPropertiesModal } from './components/edit-properties-modal/EditPropertiesModal';
import { SolicitationModal } from './components/solicitation-modal/SolicitationModal';
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
import InstallAppModal from './components/install-app-modal/InstallAppModal';
import { MainKeyboardListener } from './components/main-keyboard-listener/MainKeyboardListener';
import { useFullscreenView } from './core/ui/useFullscreenView';
import { SimplePromptModal } from './components/simple-prompt-modal/SimplePromptModal';
import { MultipleTabsWarning } from './components/multiple-tabs-warning/MultipleTabsWarning';
import { IframeWarning } from './components/iframe-warning/IframeWarning';
import { useRedirectLegacyRoutes } from './core/ui/useRedirectLegacyRoutes';

// App views, all lazy loaded
const LandingView = lazy(() => import('./views/landing/LandingView'));
const NotFoundView = lazy(() => import('./views/not-found/NotFoundView'));
const ConfirmAccountView = lazy(() => import('./views/confirm-account/ConfirmAccountView'));
const ResetPasswordView = lazy(() => import('./views/reset-password/ResetPasswordView'));
const MapView = lazy(() => import('./views/map/MapView'));
const UserAccountView = lazy(() => import('./views/user-account/UserAccountView'));
const LegalMentionsView = lazy(() => import('./views/legal-mentions/LegalMentionsView'));
const FundingView = lazy(() => import('./views/funding/FundingView'));
const SharedMapView = lazy(() => import('./views/shared-map/SharedMapView'));
const ChangelogView = lazy(() => import('./views/changelog/ChangelogView'));
const ModuleIndexView = lazy(() => import('./views/module-index-view/ModuleIndexView'));
const ModuleView = lazy(() => import('./views/module-view/ModuleView'));

export function App() {
  const fullscreenView = useFullscreenView();

  useRedirectLegacyRoutes();

  return (
    <>
      {/* Edition: with top bar, most of the views are enabled */}
      {!fullscreenView && (
        <>
          <TopBar />

          <div className={clsx(Cls.appViewport, 'abc-app-viewport')}>
            <Suspense fallback={fallbackUi()}>
              <RoutesContainer>
                <Route path={'/'} element={<LandingView />} />
                <Route path={Routes.landing().raw()} element={<LandingView />} />
                <Route path={Routes.map().raw()} element={<MapView />} />
                <Route path={Routes.confirmAccount().raw()} element={<ConfirmAccountView />} />
                <Route path={Routes.resetPassword().raw()} element={<ResetPasswordView />} />
                <Route path={Routes.userAccount().raw()} element={<UserAccountView />} />
                <Route path={Routes.legalMentions().raw()} element={<LegalMentionsView />} />
                <Route path={Routes.funding().raw()} element={<FundingView />} />
                <Route path={Routes.changelog().raw()} element={<ChangelogView />} />
                <Route path={Routes.moduleIndex().raw()} element={<ModuleIndexView />} />
                <Route path={moduleCatchAll()} element={<ModuleView />} />
                <Route path={'*'} element={<NotFoundView />} />
              </RoutesContainer>
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
          <PromptVariablesModal />
          <InstallAppModal />
          <MainKeyboardListener />
          <SimplePromptModal />
          <MultipleTabsWarning />
          <IframeWarning />
          <WarningBeforeUnload />
        </>
      )}

      {/* Map share, fullscreen */}
      {fullscreenView && (
        <>
          <div className={clsx(Cls.appViewport, 'abc-app-viewport')}>
            <Suspense fallback={fallbackUi()}>
              <RoutesContainer>
                <Route path={Routes.sharedMap().raw()} element={<SharedMapView />} />
                <Route path={'*'} element={<NotFoundView />} />
              </RoutesContainer>
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

export function moduleCatchAll(): string {
  return Routes.module().raw() + '/*';
}

export default withTranslation()(App);
