import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';

export default observer(() => {
  const store = useStore();
  return <div data-id={store}></div>;
});
