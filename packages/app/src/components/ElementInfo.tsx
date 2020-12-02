/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useMemo } from 'react';
import { useStore } from '../store';
import SidePanelEntry from './SidePanelEntry';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {},
}));

const EMPTY_ARR: string[] = [];

export default observer(() => {
  const store = useStore();
  const classes = useStyles();

  const rows = store.sortedSelectedElems;
  const attrs = store.dataset?.attrs ?? EMPTY_ARR;
  const o = store.ui.elemTable;

  const handleRequestNameSort = useCallback(() => {
    const isAsc = o.orderBy === 'name' && o.order === 'asc';
    store.ui.changeElemTableOptions({
      order: isAsc ? 'desc' : 'asc',
      orderBy: 'name',
    });
  }, [store, o]);

  const handleRequestAttrsSort = useMemo(() => {
    return attrs.map((attr) => () => {
      const property = `attrs.${attr}`;
      const isAsc = o.orderBy === property && o.order === 'asc';
      store.ui.changeElemTableOptions({
        order: isAsc ? 'desc' : 'asc',
        orderBy: property,
      });
    });
  }, [store, o, attrs]);

  return (
    <SidePanelEntry id="elems" title={`Selected ${rows.length.toLocaleString()} Items`}>
      <TableContainer>
        <Table size="small" className={classes.root}>
          <TableHead>
            <TableRow>
              <TableCell padding="none" sortDirection={o.orderBy === 'name' ? o.order : false}>
                <TableSortLabel
                  active={o.orderBy === 'name'}
                  direction={o.orderBy === 'name' ? o.order : 'asc'}
                  onClick={handleRequestNameSort}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              {attrs.map((attr, i) => (
                <TableCell key={attr} sortDirection={o.orderBy === `attrs.${attr}` ? o.order : false}>
                  <TableSortLabel
                    active={o.orderBy === `attrs.${attr}`}
                    direction={o.orderBy === `attrs.${attr}` ? o.order : 'asc'}
                    onClick={handleRequestAttrsSort[i]}
                  >
                    {attr}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {store.ui.sidePanelExpanded.has('elems') && (
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow hover tabIndex={-1} key={row.name}>
                    <TableCell component="th" scope="row" padding="none">
                      {row.name}
                    </TableCell>
                    {attrs.map((attr) => (
                      <TableCell key={attr} align="right">
                        {row.attrs[attr]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </SidePanelEntry>
  );
});
