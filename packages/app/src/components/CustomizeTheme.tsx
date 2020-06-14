/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import { useStore } from '../store';
import { UpSetThemes } from '@upsetjs/react';
import SidePanelEntry from './SidePanelEntry';
// import CP from '@taufik-nurrohman/color-picker';

function ColorTextField({
  label,
  name,
  value,
  required,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  required?: boolean;
  onChange: (e: { target: { name: string; value: string } }) => void;
}) {
  return <TextField label={label} name={name} value={value} required={required} onChange={onChange} />;
}
// let picker = new CP(document.querySelector('input'));
//     picker.on('change', function(r, g, b, a) {
//         if (1 === a) {
//             this.source.value = 'rgb(' + r + ', ' + g + ', ' + b + ')';
//         } else {
//             this.source.value = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
//         }
//     });

export default observer(() => {
  const store = useStore();

  const p = store.props;

  const handleTextChange = useCallback(
    (e: { target: { name: string; value: string } }) => store.changeProps({ [e.target.name]: e.target.value }),
    [store]
  );

  return (
    <SidePanelEntry id="theme" title="Customize Theme">
      <TextField
        label="Theme"
        value={p.theme}
        select
        required
        onChange={(e) => store.changeProps({ theme: String(e.target.value) as UpSetThemes })}
      >
        <MenuItem value="dark">Dark Theme</MenuItem>
        <MenuItem value="light">Light Theme</MenuItem>
        <MenuItem value="vega">Vega Theme</MenuItem>
      </TextField>
      <ColorTextField label="Bar Color" required name="color" value={p.color} onChange={handleTextChange} />
      <ColorTextField label="Text Color" required name="textColor" value={p.textColor} onChange={handleTextChange} />
      <ColorTextField
        label="Selection Color"
        name="selectionColor"
        value={p.selectionColor}
        required
        onChange={handleTextChange}
      />
      <ColorTextField
        label="Hover Hint Color"
        name="hoverHintColor"
        value={p.hoverHintColor}
        required
        onChange={handleTextChange}
      />
      <ColorTextField
        label="Not Member Dot Color"
        name="notMemberColor"
        value={p.notMemberColor}
        required
        onChange={handleTextChange}
      />
      <ColorTextField
        label="Alternating Background Color"
        name="alternatingBackgroundColor"
        value={p.alternatingBackgroundColor || ''}
        onChange={handleTextChange}
      />
    </SidePanelEntry>
  );
});
