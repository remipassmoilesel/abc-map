import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { services } from './core/Services';
import { getAbcWindow } from './core/utils/getWindow';
import { E2eMapWrapper } from './core/map/E2eMapWrapper';
import './index.scss';

const svc = services();

svc.authentication
  .anonymousLogin()
  .then(() => {
    // For tests and debug purposes
    getAbcWindow().abc.mainMap = new E2eMapWrapper(svc.geo.getMainMap());
    getAbcWindow().abc.services = svc;

    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('root')
    );
  })
  .catch(() => svc.toasts.genericError());

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
