import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const SidePanel: React.FC = observer(() => {
  const store = useStore();
  return (
    <aside>
      <Select
        label="DataSet"
        onChange={v => {
          store.selectDataSet(v.target.value as string);
        }}
        value={store.dataset?.name || ''}
      >
        <MenuItem value={''}>Choose...</MenuItem>
        {store.datasets.map(d => (
          <MenuItem key={d.name} value={d.name}>
            {d.name}
          </MenuItem>
        ))}
      </Select>
    </aside>
  );
});

export default SidePanel;
