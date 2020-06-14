/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import { useStore } from '../store';
import SidePanelEntry from './SidePanelEntry';
import { Histogram, Scatterplot } from '@upsetjs/plots';
import ReactResizeDetector from 'react-resize-detector';
import { IElem } from '../data';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

export default observer(() => {
  const store = useStore();

  if (!store.dataset || store.dataset.attrs.length === 0) {
    return null;
  }

  const xAcc = useCallback((v: IElem) => v.attrs[store.ui.visXAttr!], [store.ui.visXAttr]);
  const yAcc = useCallback((v: IElem) => v.attrs[store.ui.visYAttr!], [store.ui.visYAttr]);

  const renderPlot = useCallback(
    ({ width }: { width: number }) => {
      if (!store.ui.visXAttr && !store.ui.visYAttr) {
        return <div />;
      }
      if (store.ui.visXAttr && store.ui.visYAttr) {
        return (
          <div>
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
          </div>
        );
      }
      return (
        <div>
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
        </div>
      );
    },
    [store, xAcc, yAcc]
  );

  return (
    <SidePanelEntry id="vis" title="Attribute Vis">
      <TextField
        label="X Attr"
        value={store.ui.visXAttr || ''}
        select
        required
        onChange={useCallback((e) => store.ui.setVisXAttr(e.target.value), [store])}
      >
        <MenuItem value="">Choose ...</MenuItem>
        {store.dataset.attrs.map((attr) => (
          <MenuItem key={attr} value={attr}>
            {attr}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Y Attr"
        value={store.ui.visYAttr || ''}
        select
        required
        onChange={useCallback((e) => store.ui.setVisYAttr(e.target.value), [store])}
      >
        <MenuItem value="">Choose ...</MenuItem>
        {store.dataset.attrs.map((attr) => (
          <MenuItem key={attr} value={attr}>
            {attr}
          </MenuItem>
        ))}
      </TextField>
      <ReactResizeDetector handleWidth render={renderPlot} />
    </SidePanelEntry>
  );
});
