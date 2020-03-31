import React, { lazy, Suspense } from 'react';
import { observer } from 'mobx-react-lite';
import { UpSetProps } from '@upsetjs/react';
import { useStore } from '../store';
import ReactResizeDetector from 'react-resize-detector';
import Loading from './Loading';
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';

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

const UpSet = lazy(() => import('@upsetjs/react'));

const UpSetW = React.forwardRef<SVGSVGElement, Omit<UpSetProps<any>, 'width' | 'height'>>((props, ref) => {
  return (
    <ReactResizeDetector
      handleWidth
      handleHeight
      render={({ width, height }) => {
        return (
          <div>
            <Suspense fallback={<Skeleton variant="rect" width={width} height={height} />}>
              {width > 0 && height > 0 && <UpSet width={width} height={height} {...props} ref={ref} />}
            </Suspense>
          </div>
        );
      }}
    />
  );
});

export default observer(() => {
  const store = useStore();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {store.sets.length > 0 && store.dataset && (
        <UpSetW
          className={classes.wrapper}
          {...store.props}
          sets={store.visibleSets}
          queries={store.visibleQueries}
          combinations={store.visibleCombinations}
          selection={store.hover}
          onHover={store.setHover}
          onClick={store.setSelection}
          exportButtons={false}
          ref={store.ui.ref}
        />
      )}
      {!store.dataset && <Loading>Choose Dataset</Loading>}
      {store.sets.length === 0 && store.dataset && <Loading />}
    </div>
  );
});
