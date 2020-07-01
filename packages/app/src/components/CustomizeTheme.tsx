/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { UpSetThemes } from '@upsetjs/react';
import SidePanelEntry from './SidePanelEntry';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import '@taufik-nurrohman/color-picker';
import '@taufik-nurrohman/color-picker/color-picker.css';
import CheckboxBlankCircle from 'mdi-material-ui/CheckboxBlankCircle';
import CheckboxBlankCircleOutline from 'mdi-material-ui/CheckboxBlankCircleOutline';

declare class CP {
  static HEX(color: string): number[];
  static HEX(color: number[]): string;
  static RGB(color: string): number[];
  static RGB(color: number[]): string;

  constructor(parent: HTMLElement, options?: { color: string });

  color(r: number, g: number, b: number, a: number): string;

  on(type: 'change', callback: (r: number, g: number, b: number, a: number) => void): void;
  pop(): void;
}

function parseRGBA(x: string): number[] {
  let rgba: RegExpMatchArray | null;
  if (
    (rgba = x.match(
      /^rgba\s*\(\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]|0?\.\d+)\s*\)$/i
    ))
  ) {
    return [+rgba[1], +rgba[2], +rgba[3], +rgba[4]];
  }
  if (
    (rgba = x.match(
      /^rgb\s*\(\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*\)$/i
    ))
  ) {
    return [+rgba[1], +rgba[2], +rgba[3], 1];
  }
  return [0, 0, 0, 1]; // Default to black
}

CP.RGB = (x: string | number[]): any => {
  if (typeof x === 'string') {
    return x.startsWith('#') ? CP.HEX(x) : parseRGBA(x);
  }
  // Convert color data to color string
  const r = +x[0];
  const g = +x[1];
  const b = +x[2];
  const a = +('undefined' === typeof x[3] ? 1 : x[3]);
  if (1 === a) {
    // Opaque, return as RGB color string
    return CP.HEX(x); // `rgb(${r},${g},${b})`;
  }
  // Transparent, return as RGBA color string
  return `rgba(${r},${g},${b},${a})`;
};

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
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const cp = new CP(ref.current, { color: 'RGB' });
    cp.on('change', function (this: CP, r, g, b, a) {
      const color = a === 1 ? this.color(r, g, b, a) : `rgba(${r},${g},${b},${a})`;
      if (
        ref.current &&
        (ref.current.value === color || (!required && ref.current.value === '' && color === '#000000'))
      ) {
        return;
      }
      onChange({ target: { name, value: color } });
    });
    return () => cp.pop();
  }, [ref, name, onChange, required]);

  const toggleDisableColor = useCallback(() => {
    if (value === '') {
      onChange({ target: { name, value: '#000000' } });
    } else {
      onChange({ target: { name, value: '' } });
    }
  }, [onChange, value]);
  const handleMouseDown = useCallback((evt: React.MouseEvent<any>) => evt.preventDefault(), []);
  return (
    <TextField
      label={label}
      size="small"
      margin="dense"
      name={name}
      value={value}
      required={required}
      inputProps={{
        ref,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" style={{ color: value }}>
            <IconButton onClick={toggleDisableColor} onMouseDown={handleMouseDown} size="small" disabled={required}>
              {value !== '' ? <CheckboxBlankCircle /> : <CheckboxBlankCircleOutline />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default observer(() => {
  const store = useStore();

  const p = store.props;

  const handleTextChange = useCallback(
    (e: { target: { name: string; value: string } }) =>
      store.changeProps({ [e.target.name]: e.target.value === '' ? undefined : e.target.value }),
    [store]
  );
  const handleNumberChange = useCallback(
    (e: { target: { name: string; value: string } }) =>
      store.changeProps({ [e.target.name]: e.target.value === '' ? undefined : Number.parseFloat(e.target.value) }),
    [store]
  );

  return (
    <SidePanelEntry id="theme" title="Customize Theme">
      <TextField
        label="Theme"
        margin="dense"
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
      <ColorTextField
        label="Has Selection Color"
        name="hasSelectionColor"
        value={p.hasSelectionColor || ''}
        onChange={handleTextChange}
      />
      <TextField
        label="Opacity"
        size="small"
        margin="dense"
        name="opacity"
        value={p.opacity}
        type="number"
        inputProps={{
          min: 0,
          max: 1,
          step: 0.1,
        }}
        onChange={handleNumberChange}
      />
      <TextField
        label="Has Selection Opacity"
        size="small"
        margin="dense"
        name="hasSelectionOpacity"
        value={p.hasSelectionOpacity == null || p.hasSelectionOpacity < 0 ? '' : p.hasSelectionOpacity}
        type="number"
        inputProps={{
          min: 0,
          max: 1,
          step: 0.1,
        }}
        onChange={handleNumberChange}
      />
    </SidePanelEntry>
  );
});
