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

export default observer(() => {
  const store = useStore();
  const o = store.ui.setTable;
  const rows = store.sets;
  const rowCount = rows.length;
  const selected = store.selectedSets;
  const numSelected = store.selectedSets.size;

  const isSelected = (name: string) => selected.has(name);

  const handleRequestSort = (property: 'name' | 'cardinality') => {
    return () => {
      const isAsc = o.orderBy === property && o.order === 'asc';
      store.changeTableOptions({
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
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isItemSelected} />
                  </TableCell>
                  <TableCell component="th" scope="row" padding="none">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.cardinality}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </SidePanelEntry>
  );
});
