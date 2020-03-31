import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../store';
import SidePanelEntry from './SidePanelEntry';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  pointer: {
    cursor: 'pointer',
  },
  cell: {
    position: 'relative',
  },
  bar: {
    position: 'absolute',
    left: 0,
    top: '6px',
    bottom: '6px',
    backgroundColor: theme.palette.text.primary,
    opacity: 0.3,
  },
}));

export default observer(() => {
  const store = useStore();
  const classes = useStyles();

  const o = store.ui.setTable;
  const rows = store.sets;
  const rowCount = rows.length;
  const selected = store.selectedSets;
  const numSelected = store.selectedSets.size;

  const isSelected = (name: string) => selected.has(name);

  const handleRequestSort = (property: 'name' | 'cardinality') => {
    return () => {
      const isAsc = o.orderBy === property && o.order === 'asc';
      store.ui.changeSetTableOptions({
        order: isAsc ? 'desc' : 'asc',
        orderBy: property,
      });
    };
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      store.setSelectedSets(new Set(newSelecteds));
      return;
    }
    store.setSelectedSets(new Set<string>([]));
  };

  const handleClick = (_event: React.MouseEvent<unknown>, name: string) => {
    const copy = new Set(selected);

    if (!copy.has(name)) {
      copy.add(name);
    } else {
      copy.delete(name);
    }
    store.setSelectedSets(copy);
  };

  const maxCardinality = store.sortedSets.reduce((acc, d) => Math.max(acc, d.cardinality), 0);
  const c2w = (v: number) => `${Math.round((100 * v) / maxCardinality)}%`;

  return (
    <SidePanelEntry id="sets" title="Set Chooser">
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'select all sets' }}
                />
              </TableCell>
              <TableCell padding="none" sortDirection={o.orderBy === 'name' ? o.order : false}>
                <TableSortLabel
                  active={o.orderBy === 'name'}
                  direction={o.orderBy === 'name' ? o.order : 'asc'}
                  onClick={handleRequestSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={o.orderBy === 'cardinality' ? o.order : false}>
                <TableSortLabel
                  active={o.orderBy === 'cardinality'}
                  direction={o.orderBy === 'cardinality' ? o.order : 'asc'}
                  onClick={handleRequestSort('cardinality')}
                >
                  Cardinality
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          {store.ui.sidePanelExpanded.has('sets') && (
            <TableBody>
              {store.sortedSets.map((row) => {
                const isItemSelected = isSelected(row.name);
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.name)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                    className={classes.pointer}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} />
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      {row.name}
                    </TableCell>
                    <TableCell align="right" className={classes.cell}>
                      <div className={classes.bar} style={{ width: c2w(row.cardinality) }} />
                      {row.cardinality}
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
