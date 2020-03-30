import TextField from '@material-ui/core/TextField';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../store';
import SidePanelEntry from './SidePanelEntry';

export default observer(() => {
  const store = useStore();

  const p = store.props;

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    store.changeProps({ [e.target.name]: e.target.value });
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    store.changeProps({ [e.target.name]: Number.parseFloat(e.target.value) });

  return (
    <SidePanelEntry id="customize" title="Customize">
      <TextField label="Set Name" name="setName" value={p.setName} required onChange={handleTextChange} />
      <TextField
        label="Combination Name"
        name="combinationName"
        value={p.combinationName}
        required
        onChange={handleTextChange}
      />
      <TextField
        label="Axis Offset"
        name="combinationNameAxisOffset"
        value={p.combinationNameAxisOffset}
        type="number"
        required
        onChange={handleNumericChange}
      />
    </SidePanelEntry>
  );
});
