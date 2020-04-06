import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../store';
import SidePanelEntry from './SidePanelEntry';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  pointer: {
    cursor: 'pointer',
  },
}));

export default observer(() => {
  const store = useStore();
  const classes = useStyles();

  const rows = store.dataset?.attrs ?? [];
  const selected = store.selectedAttrs;
  const numSelected = selected.size;
  const rowCount = rows.length;

  if (rowCount === 0) {
    return null;
  }

  const isSelected = (name: string) => selected.has(name);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows;
      store.setSelectedAttrs(new Set(newSelecteds));
      return;
    }
    store.setSelectedAttrs(new Set<string>([]));
  };

  const handleClick = (_event: React.MouseEvent<unknown>, name: string) => {
    const copy = new Set(selected);

    if (!copy.has(name)) {
      copy.add(name);
    } else {
      copy.delete(name);
    }
    store.setSelectedAttrs(copy);
  };

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
                    onClick={(event) => handleClick(event, row)}
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
