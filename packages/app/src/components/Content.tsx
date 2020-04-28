/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core/styles';
import SidePanel from './SidePanel';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import RightSidePanel from './RightSidePanel';
import UpSetWrapper from './UpSetWrapper';
import Header from './Header';
import DrawerMenu from './DrawerMenu';
import Toast from './Toast';
import clsx from 'clsx';
import { useStore } from '../store';
import ChevronLeftIcon from 'mdi-material-ui/ChevronLeft';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexGrow: 1,
  },
  appBar: {},
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    marginLeft: -drawerWidth,
  },
  main: {
    display: 'flex',
    flexGrow: 1,
  },
  contentShift: {
    marginLeft: 0,
  },
}));

export default observer(() => {
  const classes = useStyles();
  const store = useStore();
  return (
    <div className={classes.root}>
      <Header
        className={clsx(classes.appBar, {
          [classes.appBarShift]: store.ui.menu,
        })}
      />
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={store.ui.menu}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={store.ui.toggleMenu}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <DrawerMenu />
      </Drawer>
      <div
        className={clsx(classes.content, {
          [classes.contentShift]: store.ui.menu,
        })}
      >
        <div className={classes.drawerHeader} />
        <main className={classes.main}>
          {!store.ui.zen && <SidePanel />}
          <UpSetWrapper />
          {!store.ui.zen && <RightSidePanel />}
        </main>
      </div>
      <Toast />
    </div>
  );
});
