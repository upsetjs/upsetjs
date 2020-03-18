import 'core-js';
import 'regenerator-runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { optimizeScheduler } from 'mobx-react-lite';
import App from './components/App';

optimizeScheduler(ReactDOM.unstable_batchedUpdates as any);

ReactDOM.render(<App />, document.querySelector('#app'));
