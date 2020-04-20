import React from 'react';
import { observer } from 'mobx-react-lite';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import { useStore } from '../store';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default observer(() => {
  const store = useStore();
  return (
    <Snackbar open={store.ui.toast != null} autoHideDuration={6000} onClose={store.ui.closeToast}>
      {store.ui.toast ? (
        <Alert onClose={store.ui.closeToast} severity={store.ui.toast.severity}>
          {store.ui.toast.message}
          {store.ui.toast.link && (
            <a href={store.ui.toast.link.href} target="_blank" rel="noopener noreferrer">
              {store.ui.toast.link.alt}
            </a>
          )}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
});
