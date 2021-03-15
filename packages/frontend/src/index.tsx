import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { getServices } from './core/Services';
import { getAbcWindow } from './core/utils/getWindow';
import { E2eMapWrapper } from './core/geo/map/E2eMapWrapper';
import { Logger } from '@abc-map/frontend-shared';
import { UserStatus } from '@abc-map/shared-entities';
import './index.scss';

const logger = Logger.get('index.tsx');
const svc = getServices();

authenticate()
  .then(() => load())
  .catch((err) => {
    logger.error(err);
    svc.toasts.genericError();
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
  getAbcWindow().abc.mainMap = new E2eMapWrapper(svc.geo.getMainMap());
  getAbcWindow().abc.services = svc;

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
