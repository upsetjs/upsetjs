import 'core-js';
import 'regenerator-runtime';

import React, { lazy } from 'react';
import ReactDOM from 'react-dom';
import { optimizeScheduler } from 'mobx-react-lite';

optimizeScheduler(ReactDOM.unstable_batchedUpdates as any);

const App = lazy(() => import('./components/App'));

ReactDOM.render(<App />, document.querySelector('#app'));
