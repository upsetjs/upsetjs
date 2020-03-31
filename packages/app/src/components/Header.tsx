import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from 'mdi-material-ui/Menu';
import FileImage from 'mdi-material-ui/FileImage';
import FileChart from 'mdi-material-ui/FileChart';
import FileCode from 'mdi-material-ui/FileCode';
import FileExcel from 'mdi-material-ui/FileExcel';

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import Download from 'mdi-material-ui/Download';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  select: {
    marginLeft: '1rem',
    minWidth: '20em',
    color: theme.palette.primary.contrastText,
  },
  speeddial: {
    position: 'absolute',
    right: theme.spacing(2),
    bottom: -theme.spacing(2),
  },
}));

export default observer(() => {
  const store = useStore();
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {'UpSet.js: '}
          <Select
            className={classes.select}
            onChange={(v) => {
              store.selectDataSet(v.target.value as string);
            }}
            value={store.dataset?.name || ''}
          >
            <MenuItem value={''}>Choose Dataset...</MenuItem>
            {store.datasets.map((d) => (
              <MenuItem key={d.name} value={d.name}>
                {d.name}
              </MenuItem>
            ))}
          </Select>
        </Typography>
        <SpeedDial
          ariaLabel="Export"
          icon={<Download />}
          direction="left"
          className={classes.speeddial}
          onClose={() => store.ui.setSpeedDial(false)}
          onOpen={() => store.ui.setSpeedDial(true)}
          open={store.ui.speedDial}
        >
          <SpeedDialAction
            icon={<FileImage />}
            tooltipTitle={'PNG Image'}
            tooltipPlacement="bottom"
            onClick={() => store.exportImage('png')}
          />
          <SpeedDialAction
            icon={<FileChart />}
            tooltipTitle={'SVG Image'}
            tooltipPlacement="bottom"
            onClick={() => store.exportImage('svg')}
          />
          <SpeedDialAction
            icon={<FileExcel />}
            tooltipTitle={'CSV File'}
            tooltipPlacement="bottom"
            onClick={store.exportCSV}
          />
          <SpeedDialAction
            icon={<FileCode />}
            tooltipTitle={'JSON File'}
            tooltipPlacement="bottom"
            onClick={store.exportJSON}
          />
        </SpeedDial>
      </Toolbar>
    </AppBar>
  );
});
