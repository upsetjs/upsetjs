/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import Store from './Store';

export { TEMP_QUERY_COLOR, UpSetDataQuery } from './Store';
const storeContext = React.createContext<Store | null>(null);

export const StoreProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const store = useLocalObservable(() => new Store());
  return <storeContext.Provider value={store}> {children} </storeContext.Provider>;
};

export const useStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return store;
};
