/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { lazy, Suspense } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import { IElem } from '../data/interfaces';
import ReactResizeDetector from 'react-resize-detector';
import Loading from './Loading';
import { makeStyles } from '@material-ui/core/styles';
import UpSetImpl from '@upsetjs/react';
import Skeleton from './Skeleton';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    padding: '1rem',
    flexGrow: 1,
    '& > *': {
      flexGrow: 1,
    },
  },
  wrapper: {
    position: 'absolute',
  },
}));

const UpSetJS = lazy(() => import('@upsetjs/react')) as typeof UpSetImpl;

const UpSetRenderer = observer(({ width, height }: { width: number; height: number }) => {
  const store = useStore();
  const classes = useStyles();
  return (
    <div>
      <Suspense fallback={<Skeleton />}>
        {width > 0 && height > 0 && (
          <UpSetJS<IElem>
            width={width}
            height={height}
            className={classes.wrapper}
            {...store.props}
            sets={store.visibleSets}
            queries={store.queriesAndSelection}
            combinations={store.visibleCombinations}
            selection={store.hover}
            onHover={store.setHover}
            onClick={store.setSelection}
            exportButtons={false}
            setAddons={store.visibleSetAddons}
            combinationAddons={store.visibleCombinationAddons}
            ref={store.ui.ref}
          />
        )}
      </Suspense>
    </div>
  );
});

function renderUpSetJS({ width, height }: { width: number; height: number }) {
  return <UpSetRenderer width={width} height={height} />;
}

export default observer(() => {
  const store = useStore();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {store.sets.length > 0 && store.dataset && (
        <ReactResizeDetector handleWidth handleHeight render={renderUpSetJS} />
      )}
      {!store.dataset && <Loading>Choose Dataset</Loading>}
      {store.sets.length === 0 && store.dataset && <Loading />}
    </div>
  );
});
