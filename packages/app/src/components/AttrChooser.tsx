/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import { useStore } from '../store';
import SidePanelEntry from './SidePanelEntry';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  pointer: {
    cursor: 'pointer',
  },
}));

const EMPTY_ARR: string[] = [];

export default observer(() => {
  const store = useStore();
  const classes = useStyles();

  const rows = store.dataset?.attrs ?? EMPTY_ARR;
  const selected = store.selectedAttrs;
  const numSelected = selected.size;
  const rowCount = rows.length;
  const isSelected = useCallback((name: string) => selected.has(name), [selected]);

  const handleSelectAllClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const newSelectedIds = rows;
        store.setSelectedAttrs(new Set(newSelectedIds));
        return;
      }
      store.setSelectedAttrs(new Set<string>([]));
    },
    [rows, store]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const copy = new Set(selected);
      const name = event.currentTarget.dataset.name!;

      if (!copy.has(name)) {
        copy.add(name);
      } else {
        copy.delete(name);
      }
      store.setSelectedAttrs(copy);
    },
    [selected, store]
  );

  if (rowCount === 0) {
    return null;
  }

  return (
    <SidePanelEntry id="attrs" title="Attribute Chooser">
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'select all attributes' }}
                />
              </TableCell>
              <TableCell padding="none">Name</TableCell>
            </TableRow>
          </TableHead>
          {store.ui.sidePanelExpanded.has('attrs') && (
            <TableBody>
              {rows.map((row) => {
                const isItemSelected = isSelected(row);
                return (
                  <TableRow
                    hover
                    data-name={row}
                    onClick={handleClick}
                    role="checkbox"
                    tabIndex={-1}
                    key={row}
                    selected={isItemSelected}
                    className={classes.pointer}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} />
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      {row}
                    </TableCell>
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
