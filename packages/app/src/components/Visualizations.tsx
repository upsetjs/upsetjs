/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { observer } from 'mobx-react-lite';
import React, { useCallback, RefObject } from 'react';
import { useStore } from '../store';
import SidePanelEntry from './SidePanelEntry';
import { Histogram, Scatterplot } from '@upsetjs/plots';
import ReactResizeDetector from 'react-resize-detector';
import { IElem } from '../data';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const RenderPlot = observer(({ width }: { width: number }) => {
  const store = useStore();
  const xAcc = useCallback((v: IElem) => v.attrs[store.ui.visXAttr!], [store.ui.visXAttr]);
  const yAcc = useCallback((v: IElem) => v.attrs[store.ui.visYAttr!], [store.ui.visYAttr]);

  if (!store.ui.visXAttr && !store.ui.visYAttr) {
    return null;
  }

  if (store.ui.visXAttr && store.ui.visYAttr) {
    return (
      <Scatterplot
        width={width - 40}
        height={width - 40}
        elems={store.elems}
        xAttr={xAcc}
        yAttr={yAcc}
        actions={false}
        selection={store.hover}
        onHover={store.setHover}
        onClick={store.setSelection}
        queries={store.visibleQueries}
      />
    );
  }
  return (
    <Histogram
      width={width - 40}
      height={200}
      elems={store.elems}
      attr={xAcc}
      actions={false}
      selection={store.hover}
      onHover={store.setHover}
      onClick={store.setSelection}
      queries={store.visibleQueries}
    />
  );
});

function renderChart({ width, targetRef }: { width: number; targetRef?: RefObject<HTMLDivElement> }) {
  return (
    <div ref={targetRef}>
      <RenderPlot width={width} />
    </div>
  );
}

export default observer(() => {
  const store = useStore();
  const x = useCallback((e: React.ChangeEvent<{ value: string }>) => store.ui.setVisXAttr(e.target.value), [store]);
  const y = useCallback((e: React.ChangeEvent<{ value: string }>) => store.ui.setVisYAttr(e.target.value), [store]);

  if (!store.dataset || store.dataset.attrs.length === 0) {
    return null;
  }
  return (
    <SidePanelEntry id="vis" title="Attribute Vis">
      <TextField margin="dense" label="X Attr" value={store.ui.visXAttr || ''} select required onChange={x}>
        <MenuItem value="">Choose ...</MenuItem>
        {store.dataset.attrs.map((attr) => (
          <MenuItem key={attr} value={attr}>
            {attr}
          </MenuItem>
        ))}
      </TextField>
      <TextField margin="dense" label="Y Attr" value={store.ui.visYAttr || ''} select required onChange={y}>
        <MenuItem value="">Choose ...</MenuItem>
        {store.dataset.attrs.map((attr) => (
          <MenuItem key={attr} value={attr}>
            {attr}
          </MenuItem>
        ))}
      </TextField>
      {store.ui.sidePanelExpanded.has('vis') && <ReactResizeDetector handleWidth render={renderChart} />}
    </SidePanelEntry>
  );
});
