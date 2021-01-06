/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import { useStore } from '../store';
import SidePanelEntry from './SidePanelEntry';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

function EditFontSize({
  label,
  value,
  name,
  onChange,
}: React.PropsWithChildren<{
  label: string;
  value: string;
  name: string;
  onChange: (name: string, v: string) => void;
}>) {
  const numeric = Number.parseFloat(value);
  const unit = value.slice(numeric.toString().length);
  const handleValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(name, `${event.target.value}${unit}`);
    },
    [onChange, name, unit]
  );
  const handleUnitChange = useCallback(
    (event: React.ChangeEvent<any>) => {
      onChange(name, `${numeric}${event.target.value}`);
    },
    [onChange, name, numeric]
  );
  return (
    <TextField
      margin="dense"
      label={label}
      value={numeric}
      name={name}
      type="number"
      inputProps={{
        min: 0,
        step: 1,
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Select value={unit} onChange={handleUnitChange}>
              <MenuItem value="px">px</MenuItem>
              <MenuItem value="pt">pt</MenuItem>
            </Select>
          </InputAdornment>
        ),
      }}
      required
      onChange={handleValueChange}
    />
  );
}

export default observer(() => {
  const store = useStore();

  const p = store.props;

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => store.changeProps({ [e.target.name]: e.target.value }),
    [store]
  );
  const handleNumericChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      store.changeProps({ [e.target.name]: Number.parseFloat(e.target.value) }),
    [store]
  );
  const handleOffsetNumericChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      store.changeProps({ [e.target.name]: e.target.value === '' ? 'auto' : Number.parseFloat(e.target.value) }),
    [store]
  );
  const handleFontChange = useCallback((name: string, value: string) => store.changeFontSize({ [name]: value }), [
    store,
  ]);

  return (
    <SidePanelEntry id="customize" title="Customize">
      <TextField
        margin="dense"
        label="Set Name"
        name="setName"
        value={p.setName}
        required
        onChange={handleTextChange}
      />
      <TextField
        size="small"
        margin="none"
        label="Set Axis Offset"
        name="setNameAxisOffset"
        value={p.setNameAxisOffset === 'auto' ? '' : p.setNameAxisOffset}
        type="number"
        onChange={handleOffsetNumericChange}
      />
      <TextField
        margin="dense"
        label="Combination Name"
        name="combinationName"
        value={p.combinationName}
        required
        onChange={handleTextChange}
      />
      <TextField
        size="small"
        margin="none"
        label="Combination Axis Offset"
        name="combinationNameAxisOffset"
        value={p.combinationNameAxisOffset === 'auto' ? '' : p.combinationNameAxisOffset}
        type="number"
        onChange={handleOffsetNumericChange}
      />
      <TextField
        margin="dense"
        label="Font Family"
        name="fontFamily"
        value={p.fontFamily}
        required
        onChange={handleTextChange}
      />

      <EditFontSize
        label="Chart Font Size"
        value={p.fontSizes.chartLabel!}
        name="chartLabel"
        onChange={handleFontChange}
      />
      <EditFontSize
        label="Set Label Font Size"
        value={p.fontSizes.setLabel!}
        name="setLabel"
        onChange={handleFontChange}
      />

      <Divider />
      <TextField
        margin="dense"
        label="Axis Scale"
        value={p.numericScale === 'linear' ? 'linear' : 'log'}
        select
        required
        onChange={(e) => store.changeProps({ numericScale: String(e.target.value) === 'log' ? 'log' : 'linear' })}
      >
        <MenuItem value="linear">Linear Scale</MenuItem>
        <MenuItem value="log">Log Scale</MenuItem>
      </TextField>
      <TextField
        margin="dense"
        label="Bar Padding"
        name="barPadding"
        value={p.barPadding}
        type="number"
        required
        inputProps={{
          min: 0,
          max: 1,
          step: 0.1,
        }}
        onChange={handleNumericChange}
      />
      <TextField
        margin="dense"
        label="Dot Padding"
        name="dotPadding"
        value={p.dotPadding}
        type="number"
        required
        inputProps={{
          min: 0,
          max: 1,
          step: 0.1,
        }}
        onChange={handleNumericChange}
      />
      <TextField
        margin="dense"
        label="Chart Padding"
        name="padding"
        value={p.padding}
        type="number"
        required
        onChange={handleNumericChange}
      />
      <TextField
        margin="dense"
        label="Combination to Set Height Ratio"
        value={p.heightRatios[0]}
        type="number"
        required
        inputProps={{
          min: 0,
          max: 1,
          step: 0.1,
        }}
        onChange={(e) => {
          const v = Number.parseFloat(e.target.value);
          store.changeProps({
            heightRatios: [v],
          });
        }}
      />
      <TextField
        margin="dense"
        label="Combination to Set Width Ratio"
        value={1 - p.widthRatios[0] - p.widthRatios[1]}
        type="number"
        required
        inputProps={{
          min: 0,
          max: 1,
          step: 0.05,
        }}
        onChange={(e) => {
          const v = Number.parseFloat(e.target.value);
          const sum = p.widthRatios[0] + p.widthRatios[1];
          const v0 = ((1 - v) * p.widthRatios[0]) / sum;
          const v1 = ((1 - v) * p.widthRatios[1]) / sum;
          store.changeProps({
            widthRatios: [v0, v1],
          });
        }}
      />
      <TextField
        margin="dense"
        label="Set to Label Width Ratio"
        value={p.widthRatios[0] / (p.widthRatios[0] + p.widthRatios[1])}
        type="number"
        required
        inputProps={{
          min: 0,
          max: 1,
          step: 0.05,
        }}
        onChange={(e) => {
          const v = Number.parseFloat(e.target.value);
          const sum = p.widthRatios[0] + p.widthRatios[1];
          const v0 = v * sum;
          const v1 = (1 - v) * sum;
          store.changeProps({
            widthRatios: [v0, v1],
          });
        }}
      />
      <Divider />
      <Button onClick={store.resetProps}>Reset</Button>
    </SidePanelEntry>
  );
});
