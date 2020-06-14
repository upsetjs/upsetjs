/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from 'mdi-material-ui/Menu';
import FileImage from 'mdi-material-ui/FileImage';
import FileChart from 'mdi-material-ui/FileChart';
import FileCode from 'mdi-material-ui/FileCode';
import FileExcel from 'mdi-material-ui/FileExcel';
import Codepen from 'mdi-material-ui/Codepen';
import JSFiddle from 'mdi-material-ui/Jsfiddle';
import CodeString from 'mdi-material-ui/CodeString';
import LanguageR from 'mdi-material-ui/LanguageR';
import LanguagePython from 'mdi-material-ui/LanguagePython';

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import Download from 'mdi-material-ui/Download';
import Upload from 'mdi-material-ui/Upload';
import ShareCircle from 'mdi-material-ui/ShareCircle';
import RemoveCircle from 'mdi-material-ui/MinusCircle';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import clsx from 'clsx';
import { IDataSet } from '../data';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  title: {},
  select: {
    marginLeft: '1rem',
    minWidth: '20em',
    color: theme.palette.primary.contrastText,
  },
  menu: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  speeddial: {
    position: 'absolute',
    right: theme.spacing(2),
    bottom: -theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
  line: {
    display: 'flex',
    alignItems: 'center',
  },
  file: {
    position: 'absolute',
    left: -10000,
    top: -10000,
    visibility: 'hidden',
  },
}));

function toTitle(dataset?: IDataSet | null) {
  if (!dataset) {
    return 'Choose Dataset...';
  }
  const sets = dataset.setCount ? `${dataset.setCount} sets` : null;
  const attrs = dataset.attrs.length > 0 ? `${dataset.attrs.length} attributes` : null;
  if (!sets && !attrs) {
    return dataset.name;
  }
  return `${dataset.name} (${[sets, attrs].filter(Boolean).join(', ')})`;
}

export default observer(({ className }: { className?: string }) => {
  const store = useStore();
  const classes = useStyles();
  const ref = React.useRef<HTMLInputElement>(null);

  const dragOver = useCallback((evt: React.DragEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
  }, []);
  const drop = useCallback(
    (evt: React.DragEvent) => {
      if (evt.dataTransfer.files.length !== 1) {
        return;
      }
      evt.preventDefault();
      store.importFile(evt.dataTransfer.files[0]);
    },
    [store]
  );

  const clickFile = useCallback(() => {
    if (ref.current) {
      ref.current.click();
    }
  }, []);

  const onFile = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const file = evt.target.files![0];
      evt.target.value = '';
      store.importFile(file);
    },
    [store]
  );

  return (
    <AppBar position="fixed" className={className}>
      <Toolbar>
        <IconButton
          edge="start"
          className={clsx(classes.menuButton, store.ui.menu && classes.hide)}
          color="inherit"
          aria-label="menu"
          onClick={store.ui.toggleMenu}
        >
          <MenuIcon />
        </IconButton>
        <div className={classes.line} onDragOver={dragOver} onDrop={drop}>
          <Typography variant="h6" className={classes.title}>
            {'UpSet.js: '}
            <Select
              className={classes.select}
              onChange={useCallback(
                (v) => {
                  store.selectDataSet(v.target.value as string);
                },
                [store]
              )}
              value={store.dataset?.id || ''}
              renderValue={() => toTitle(store.dataset)}
            >
              <MenuItem value={''}>Choose Dataset...</MenuItem>
              {store.datasets.map((d) => (
                <MenuItem key={d.id} value={d.id} className={classes.menu}>
                  <span>{toTitle(d)}</span>
                  {d.uid != null && (
                    <IconButton onClick={() => store.deleteDataSet(d)} edge="end" size="small">
                      <RemoveCircle />
                    </IconButton>
                  )}
                </MenuItem>
              ))}
            </Select>
          </Typography>
          <Tooltip title="CSV file or JSON UpSet.js Dump file">
            <IconButton onClick={clickFile}>
              <Upload />
            </IconButton>
          </Tooltip>
        </div>
        <div className={classes.grow}>
          <input
            ref={ref}
            type="file"
            className={classes.file}
            onChange={onFile}
            accept=".json,.csv,application/json,text/csv"
          />
        </div>
        <SpeedDial
          ariaLabel="Export"
          icon={<Download />}
          direction="left"
          hidden={store.dataset == null}
          className={classes.speeddial}
          onClose={useCallback(() => store.ui.setSpeedDial(false), [store])}
          onOpen={useCallback(() => store.ui.setSpeedDial(true), [store])}
          open={store.ui.speedDial}
        >
          <SpeedDialAction
            icon={<FileImage />}
            tooltipTitle={'PNG Image'}
            tooltipPlacement="bottom"
            onClick={store.exportPNG}
          />
          <SpeedDialAction
            icon={<FileChart />}
            tooltipTitle={'SVG Image'}
            tooltipPlacement="bottom"
            onClick={store.exportSVG}
          />
          <SpeedDialAction
            icon={<FileChart />}
            tooltipTitle={'Vega Lite Specification (static)'}
            tooltipPlacement="bottom"
            onClick={store.exportVega}
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
          <SpeedDialAction
            icon={<FileCode />}
            tooltipTitle={'Static JSON File'}
            tooltipPlacement="bottom"
            onClick={store.exportStaticJSON}
          />
          <SpeedDialAction
            icon={<Codepen />}
            tooltipTitle={'Export to Codepen.io'}
            tooltipPlacement="bottom"
            onClick={store.exportCodepen}
          />
          <SpeedDialAction
            icon={<JSFiddle />}
            tooltipTitle={'Export to JSFiddle'}
            tooltipPlacement="bottom"
            onClick={store.exportJSFiddle}
          />
          <SpeedDialAction
            icon={<CodeString />}
            tooltipTitle={'Export to CodeSandbox.io'}
            tooltipPlacement="bottom"
            onClick={store.exportCodesandbox}
          />
          <SpeedDialAction
            icon={<LanguageR />}
            tooltipTitle={'Create R Script'}
            tooltipPlacement="bottom"
            onClick={store.exportR}
          />
          <SpeedDialAction
            icon={<LanguagePython />}
            tooltipTitle={'Create Jupyter Notebook'}
            tooltipPlacement="bottom"
            onClick={store.exportPython}
          />
          <SpeedDialAction
            icon={<ShareCircle />}
            tooltipTitle={'Open Embedded Version'}
            tooltipPlacement="bottom"
            onClick={store.sharedEmbedded}
          />
        </SpeedDial>
      </Toolbar>
    </AppBar>
  );
});
