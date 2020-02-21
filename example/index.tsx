import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import UpSet from '../.';

const App = () => {
  return (
    <div>
      <UpSet />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
