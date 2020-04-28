/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core/styles';
import CustomizeTheme from './CustomizeTheme';
import Queries from './Queries';
import CustomizeProps from './CustomizeProps';
import ElementInfo from './ElementInfo';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    overflow: 'auto',
    position: 'relative',
    width: '15vw',
    borderLeft: `1px solid ${theme.palette.primary.main}`,
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
        <Queries />
        <ElementInfo />
        <CustomizeTheme />
        <CustomizeProps />
      </div>
    </Paper>
  );
});
