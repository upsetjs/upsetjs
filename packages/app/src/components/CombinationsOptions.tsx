import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core/styles';
import { useStore } from '../store';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
}));

export default observer(() => {
  const store = useStore();
  const classes = useStyles();

  const c = store.visibleCombinations;
  return (
    <Paper className={classes.root}>
      <Typography variant="h6">Filter Intersections</Typography>
      <TextField
        label="Min"
        value={c.min}
        type="number"
        inputProps={{
          min: 0,
        }}
        onChange={(e) => store.changeCombinations({ min: Number.parseInt(e.target.value, 10) })}
      />
      <TextField
        label="Max"
        value={c.max}
        type="number"
        inputProps={{
          min: 0,
        }}
        onChange={(e) => store.changeCombinations({ max: Number.parseInt(e.target.value, 10) })}
      />
      <Switch />
    </Paper>
  );
});
