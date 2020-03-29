import React, { lazy, Suspense } from 'react';
import { observer } from 'mobx-react-lite';
import { UpSetProps } from '@upsetjs/react';
import { useStore } from '../store';
import ReactResizeDetector from 'react-resize-detector';
import Loading from './Loading';
import { makeStyles } from '@material-ui/core/styles';

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

const UpSetW: React.FC<Omit<UpSetProps<any>, 'width' | 'height'>> = (props) => {
  return (
    <ReactResizeDetector
      handleWidth
      handleHeight
      render={({ width, height }) => {
        return (
          <div>
            <Suspense fallback={<Loading />}>
              {width > 0 && height > 0 && <UpSet width={width} height={height} {...props} />}
            </Suspense>
          </div>
        );
      }}
    />
  );
};

export default observer(() => {
  const store = useStore();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {store.sets.length > 0 && store.dataset && (
        <UpSetW
          theme="dark"
          className={classes.wrapper}
          {...store.props}
          sets={store.visibleSets}
          combinations={store.visibleCombinations}
          selection={store.hover || store.selection}
          onHover={store.setHover}
          onClick={store.setSelection}
        />
      )}
      {!store.dataset && <Loading>Choose Dataset</Loading>}
      {store.sets.length === 0 && store.dataset && <Loading />}
    </div>
  );
});
