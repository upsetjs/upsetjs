import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../store';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const SidePanel: React.FC = observer(() => {
  const store = useStore();
  return (
    <aside>
      <TextField
        select
        label="DataSet"
        onChange={v => {
          store.selectDataSet(v.currentTarget.value);
        }}
        value={store.dataset?.name || ''}
      >
        <MenuItem value={''}>Choose...</MenuItem>
        {store.datasets.map(d => (
          <MenuItem key={d.name} value={d.name}>
            {d.name}
          </MenuItem>
        ))}
      </TextField>
    </aside>
  );
});

export default SidePanel;
