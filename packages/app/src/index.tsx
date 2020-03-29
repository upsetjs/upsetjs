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
