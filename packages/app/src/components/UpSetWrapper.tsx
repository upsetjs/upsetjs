import React from 'react';
import { observer } from 'mobx-react-lite';
import UpSet, { UpSetProps } from '@upsetjs/react';
import { useStore } from '../store';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactResizeDetector from 'react-resize-detector';

const UpSetW: React.FC<Omit<UpSetProps<any>, 'width' | 'height'>> = (props) => {
  return (
    <ReactResizeDetector
      handleWidth
      handleHeight
      render={({ width, height }) => <UpSet width={width} height={height} {...props} />}
    />
  );
};

export default observer(() => {
  const store = useStore();
  return store.setsPromise.case({
    fulfilled: (sets) => <UpSetW sets={sets} />,
    pending: () => <CircularProgress />,
  });
});
