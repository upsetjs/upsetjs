/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import MenuItem from '@material-ui/core/MenuItem';
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

  return (
    <SidePanelEntry id="theme" title="Customize Theme">
      <TextField
        label="Theme"
        value={p.theme}
        select
        required
        onChange={(e) => store.changeProps({ theme: String(e.target.value) === 'dark' ? 'dark' : 'light' })}
      >
        <MenuItem value="dark">Dark Theme</MenuItem>
        <MenuItem value="light">Light Theme</MenuItem>
      </TextField>
      <TextField label="Bar Color" required name="color" value={p.color} type="color" onChange={handleTextChange} />
      <TextField
        label="Text Color"
        required
        name="textColor"
        value={p.textColor}
        type="color"
        onChange={handleTextChange}
      />
      <TextField
        label="Selection Color"
        name="selectionColor"
        value={p.selectionColor}
        type="color"
        required
        onChange={handleTextChange}
      />
      <TextField
        label="Hover Hint Color"
        name="hoverHintColor"
        value={p.hoverHintColor}
        type="color"
        required
        onChange={handleTextChange}
      />
      <TextField
        label="Not Member Dot Color"
        name="notMemberColor"
        value={p.notMemberColor}
        type="color"
        required
        onChange={handleTextChange}
      />
      <TextField
        label="Alternating Background Color"
        name="alternatingBackgroundColor"
        value={p.alternatingBackgroundColor}
        type="color"
        onChange={handleTextChange}
      />
    </SidePanelEntry>
  );
});
