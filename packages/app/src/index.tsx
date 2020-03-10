import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';

function App() {
  return <Button color="primary">Hello World</Button>;
}

ReactDOM.render(<App />, document.querySelector('#app'));
