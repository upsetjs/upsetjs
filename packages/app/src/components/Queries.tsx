import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import AddBox from '@material-ui/icons/AddBox';
import { UpSetSetQuery } from '@upsetjs/model';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore, TEMP_QUERY_COLOR } from '../store';
import SidePanelEntry from './SidePanelEntry';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(() => ({
  root: {},
}));

const SelectionLine = observer(() => {
  const store = useStore();
  const selection = store.selection!;
  return (
    <ListItem>
      <ListItemIcon onClick={() => store.persistSelection()}>
        <Tooltip title="Persist Selection">
          <IconButton edge="start" aria-label="persist">
            <AddBox style={{ color: TEMP_QUERY_COLOR }} />
          </IconButton>
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary={`${selection.name}: ${selection.cardinality}`} />
    </ListItem>
  );
});

const QueryLine = observer(({ query, visible }: { query: UpSetSetQuery<any>; visible: boolean }) => {
  const store = useStore();
  return (
    <ListItem>
      <ListItemIcon onClick={() => store.toggleQueryVisibility(query)}>
        <Checkbox
          edge="start"
          checked={visible}
          tabIndex={-1}
          disableRipple
          style={{
            color: query.color,
          }}
        />
      </ListItemIcon>
      <ListItemText primary={`${query.name}: ${query.set.cardinality}`} />
      <ListItemSecondaryAction>
        <Tooltip title="Remove Query">
          <IconButton edge="end" aria-label="delete" onClick={() => store.deleteQuery(query)}>
            <RemoveCircle />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
});

export default observer(() => {
  const store = useStore();
  const classes = useStyles();

  return (
    <SidePanelEntry id="queries" title="Queries" className={classes.root}>
      <List dense>
        {store.selection && (
          <>
            <SelectionLine />
            <Divider />
          </>
        )}
        {store.queries.map(({ q, visible }) => (
          <QueryLine key={q.name + q.color} query={q} visible={visible} />
        ))}
      </List>
    </SidePanelEntry>
  );
});
