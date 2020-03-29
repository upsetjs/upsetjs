import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core/styles';
import { useStore } from '../store';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
}));

export default observer(() => {
  const store = useStore();
  const classes = useStyles();

  const ds = store.dataset;
  return (
    <Paper className={classes.root}>
      <Typography variant="h6">Dataset Information</Typography>
      <Typography variant="subtitle2">Name:</Typography>
      <Typography>{ds?.name}</Typography>
      <Typography variant="subtitle2">#Sets:</Typography>
      <Typography>{store.sets.length}</Typography>
      <Typography variant="subtitle2">Author:</Typography>
      <Typography>{ds?.author}</Typography>
      <Typography variant="subtitle2">Description:</Typography>
      <Typography>{ds?.description}</Typography>
    </Paper>
  );
});
