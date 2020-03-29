import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../store';
import SidePanelEntry from './SidePanelEntry';

export default observer(() => {
  const store = useStore();

  const c = store.combinationsOptions;

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    store.changeCombinations({ [e.target.name]: Number.parseInt(e.target.value, 10) });
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    store.changeCombinations({ [e.target.name]: e.target.checked });

  return (
    <SidePanelEntry id="options" title="Filter Combinations">
      <TextField
        label="Mode"
        value={c.type}
        select
        onChange={(e) =>
          store.changeCombinations({ type: String(e.target.value) === 'intersection' ? 'intersection' : 'union' })
        }
      >
        <MenuItem value="intersection">Set Intersections</MenuItem>
        <MenuItem value="union">Set Unions</MenuItem>
      </TextField>
      <TextField
        label="Mininum Set Members"
        value={c.min}
        name="min"
        type="number"
        inputProps={{
          min: 0,
          max: store.sets.length > 0 ? store.sets.length : undefined,
        }}
        onChange={handleNumberChange}
      />
      <TextField
        label="Maximum Set Members"
        name="max"
        value={c.max}
        type="number"
        inputProps={{
          min: 1,
          max: store.sets.length > 0 ? store.sets.length : undefined,
        }}
        onChange={handleNumberChange}
      />
      <TextField
        label="Max # Combinations"
        name="limit"
        value={c.limit}
        type="number"
        inputProps={{
          min: 1,
        }}
        onChange={handleNumberChange}
      />
      <FormControlLabel
        control={<Switch checked={c.empty} onChange={handleSwitchChange} name="empty" />}
        label="Include Empty Combinations"
      />
    </SidePanelEntry>
  );
});
