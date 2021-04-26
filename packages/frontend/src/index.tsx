import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { getServices } from './core/Services';
import { E2eMapWrapper } from './core/geo/map/E2eMapWrapper';
import { getAbcWindow, Logger } from '@abc-map/frontend-commons';
import { UserStatus } from '@abc-map/shared-entities';
import { mainStore } from './core/store/store';
import './index.scss';

const logger = Logger.get('index.tsx');
const svc = getServices();

authenticate()
  .then(() => load())
  .catch((err) => {
    logger.error(err);
    loadingError();
  });

// TODO: test
async function authenticate(): Promise<void> {
  const isAuthenticated = svc.authentication.getUserStatus() === UserStatus.Authenticated;
  if (isAuthenticated) {
    return svc.authentication.renew().catch((err) => {
      svc.toasts.error('Vous devez vous reconnecter');
      logger.error(err);
      return svc.authentication.anonymousLogin();
    });
  } else {
    return svc.authentication.anonymousLogin();
  }
}

function load() {
  // For tests and debug purposes
  const _window = getAbcWindow();
  _window.abc.mainMap = new E2eMapWrapper(svc.geo.getMainMap());
  _window.abc.services = svc;
  _window.abc.store = mainStore;

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

function loadingError(): void {
  const message = 'Une erreur est survenue, veuillez réessayer plus tard.';
  const root = document.querySelector('#root');
  if (!root) {
    alert(message);
    return;
  }
  root.innerHTML = `<h5 class='text-center my-5'>${message}</h5>`;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
