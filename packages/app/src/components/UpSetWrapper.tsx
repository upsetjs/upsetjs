import React, { lazy, Suspense } from 'react';
import { observer } from 'mobx-react-lite';
import { UpSetProps } from '@upsetjs/react';
import { useStore } from '../store';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactResizeDetector from 'react-resize-detector';

const UpSet = lazy(() => import('@upsetjs/react'));

const UpSetW: React.FC<Omit<UpSetProps<any>, 'width' | 'height'>> = (props) => {
  return (
    <ReactResizeDetector
      handleWidth
      handleHeight
      render={({ width, height }) => (
        <Suspense fallback={<CircularProgress />}>
          <UpSet width={width} height={height} {...props} />
        </Suspense>
      )}
    />
  );
};

export default observer(() => {
  const store = useStore();
  const sets = store.sets;
  if (sets.length === 0) {
    return <CircularProgress />;
  }
  return <UpSetW sets={sets} />;
});
