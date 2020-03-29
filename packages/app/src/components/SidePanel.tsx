import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core/styles';
import DataSetInfo from './DataSetInfo';
import CombinationsOptions from './CombinationsOptions';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '15vw',
    borderRight: `1px solid ${theme.palette.primary.main}`,
  },
}));

export default observer(() => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <CombinationsOptions />
      <DataSetInfo />
    </Paper>
  );
});
