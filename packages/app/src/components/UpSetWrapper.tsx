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
}));

const UpSet = lazy(() => import('@upsetjs/react'));

const UpSetW: React.FC<Omit<UpSetProps<any>, 'width' | 'height'>> = (props) => {
  return (
    <ReactResizeDetector
      handleWidth
      handleHeight
      render={({ width, height }) => {
        if (props.sets.length === 0) {
          return <Loading />;
        }
        return (
          <Suspense fallback={<Loading />}>
            <UpSet width={width} height={height} {...props} />
          </Suspense>
        );
      }}
    />
  );
};

export default observer(() => {
  const store = useStore();
  const classes = useStyles();
  const sets = store.sets;

  return (
    <div className={classes.root}>
      <UpSetW sets={sets} />
    </div>
  );
});
