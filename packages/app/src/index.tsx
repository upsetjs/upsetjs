import 'core-js';
import 'regenerator-runtime';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import UpSet from '@upsetjs/react';
import { ISets } from '@upsetjs/model';
import datasets, { IDataset } from './data';
import { TextField, MenuItem } from '@material-ui/core';

function App() {
  const [dataset, setDataset] = useState(null as null | (IDataset & { resolved: ISets<any> }));
  return (
    <div>
      <TextField
        select
        label="DataSet"
        onChange={v => {
          console.log(v.currentTarget.value);
          const ds = datasets.find(d => d.name === v.currentTarget.value)!;
          if (!ds) {
            setDataset(null);
            return;
          }
          ds.sets().then(resolved => setDataset({ ...ds, resolved }));
        }}
        value={dataset?.name || ''}
      >
        <MenuItem value={''}>Choose...</MenuItem>
        {datasets.map(d => (
          <MenuItem key={d.name} value={d.name}>
            {d.name}
          </MenuItem>
        ))}
      </TextField>
      {dataset && dataset.resolved && <UpSet sets={dataset.resolved} width={1200} height={300} />}
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));
