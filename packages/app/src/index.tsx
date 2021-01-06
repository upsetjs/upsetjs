/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import 'core-js/stable';
import 'regenerator-runtime';

import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import Skeleton from './components/Skeleton';

const App = lazy(() => import('./components/App'));

ReactDOM.render(
  <Suspense fallback={<Skeleton />}>
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
