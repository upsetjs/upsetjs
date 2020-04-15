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

  const order = Array.isArray(c.order) ? c.order.join(',') : c.order ?? '';

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    store.changeCombinations({ [e.target.name]: Number.parseInt(e.target.value, 10) });
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    store.changeCombinations({ [e.target.name]: e.target.checked });

  return (
    <SidePanelEntry id="options" title="Set Combinations">
      <TextField
        label="Ordering"
        value={order}
        select
        required
        onChange={(e) =>
          store.changeCombinations({
            order: e.target.value.split(',') as ReadonlyArray<'group' | 'cardinality' | 'name' | 'degree'>,
          })
        }
      >
        <MenuItem value="name">1. Name</MenuItem>
        <MenuItem value="cardinality,name">1. Cardinality 2. Name</MenuItem>
        <MenuItem value="cardinality,degree,name">1. Cardinality 2. Degree 3. Name</MenuItem>
        <MenuItem value="degree,name">1. Degree 2. Name</MenuItem>
        <MenuItem value="degree,cardinality,name">1. Degree 2. Cardinality 3. Name</MenuItem>
        <MenuItem value="group,name">1. Set Group 2. Name</MenuItem>
        <MenuItem value="group,cardinality,name">1. Set Group 2. Cardinality 3. Name</MenuItem>
        <MenuItem value="group,degree,name">1. Set Group 2. Degree 3. Name</MenuItem>
        <MenuItem value="group,degree,cardinality,name">1. Set Group 2. Degree 3. Cardinality 4. Name</MenuItem>
      </TextField>
      <TextField
        label="Mode"
        value={c.type}
        select
        required
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
        required
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
        required
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
        required
        inputProps={{
          min: 1,
        }}
        onChange={handleNumberChange}
      />
      <FormControlLabel
        control={<Switch checked={c.empty} onChange={handleSwitchChange} name="empty" size="small" />}
        label="Include Empty Combinations"
      />
    </SidePanelEntry>
  );
});
