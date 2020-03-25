import React from 'react';
import { observer } from 'mobx-react-lite';
import UpSet from '@upsetjs/react';
import { useStore } from '../store';

const UpSetWrapper: React.FC = observer(() => {
  const store = useStore();
  return store.setsPromise.case({
    fulfilled: (sets) => <UpSet sets={sets} width={1200} height={300} />,
    pending: () => <div></div>,
  });
});

export default UpSetWrapper;
