/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { lazy, Suspense, RefObject } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import { IElem } from '../data/interfaces';
import ReactResizeDetector from 'react-resize-detector';
import Loading from './Loading';
import { makeStyles } from '@material-ui/core/styles';
import { VennDiagram as VennDiagramImpl } from '@upsetjs/react';
import Skeleton from './Skeleton';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    padding: '1rem',
    height: 200,
    '& > *': {
      flexGrow: 1,
    },
  },
  wrapper: {
    position: 'absolute',
  },
}));

const VennDiagram = lazy(() =>
  import('@upsetjs/react').then((m) => ({ default: m.VennDiagram }))
) as typeof VennDiagramImpl;

const VennDiagramRenderer = observer(
  ({ width, targetRef }: { width: number; targetRef?: RefObject<HTMLDivElement> }) => {
    const store = useStore();
    const classes = useStyles();
    return (
      <div ref={targetRef}>
        <Suspense fallback={<Skeleton />}>
          {width > 0 && (
            <VennDiagram<IElem>
              width={width}
              height={200}
              className={classes.wrapper}
              {...store.props}
              sets={store.visibleVennSets}
              queries={store.queriesAndSelection}
              selection={store.hover}
              onHover={store.setHover}
              onClick={store.setSelection}
              exportButtons={false}
              queryLegend={false}
              ref={store.ui.ref}
            />
          )}
        </Suspense>
      </div>
    );
  }
);

function renderVennDiagram({ width, targetRef }: { width: number; targetRef?: RefObject<HTMLDivElement> }) {
  return <VennDiagramRenderer width={width} targetRef={targetRef} />;
}

export default observer(() => {
  const store = useStore();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {store.sets.length > 0 && store.dataset && <ReactResizeDetector handleWidth render={renderVennDiagram} />}
      {!store.dataset && <Loading>Choose Dataset</Loading>}
      {store.sets.length === 0 && store.dataset && <Loading />}
    </div>
  );
});
