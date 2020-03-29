import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core/styles';
import DataSetInfo from './DataSetInfo';
import CombinationsOptions from './CombinationsOptions';
import SetChooser from './SetChooser';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    overflow: 'auto',
    position: 'relative',
    width: '15vw',
    borderRight: `1px solid ${theme.palette.primary.main}`,
  },
  root: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default observer(() => {
  const classes = useStyles();
  return (
    <Paper className={classes.wrapper}>
      <div className={classes.root}>
        <CombinationsOptions />
        <SetChooser />
        <DataSetInfo />
      </div>
    </Paper>
  );
});
