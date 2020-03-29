import 'core-js';
import 'regenerator-runtime';

import './assets/favicon';

import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { optimizeScheduler } from 'mobx-react-lite';

optimizeScheduler(ReactDOM.unstable_batchedUpdates as any);

const App = lazy(() => import('./components/App'));

ReactDOM.render(
  <Suspense fallback={'Loading...'}>
    <App />
  </Suspense>,
  document.querySelector('#app')
);

// register service worker
if (process.env.PRODUCTION && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.warn('SW registration failed: ', registrationError);
      });
  });
}
