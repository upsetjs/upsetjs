import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default function ({ children }: React.PropsWithChildren<{}>) {
  const classes = useStyles();

  return <div className={classes.root}>{children ?? <CircularProgress />}</div>;
}
