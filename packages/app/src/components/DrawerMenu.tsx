import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import Switch from '@material-ui/core/Switch';

export default observer(() => {
  const store = useStore();
  return (
    <>
      <Divider />
      <List>
        <ListItem button onClick={store.ui.toggleZen}>
          <ListItemIcon>
            <Switch checked={store.ui.zen} />
          </ListItemIcon>
          <ListItemText>Zen Mode</ListItemText>
        </ListItem>
        <ListItem button onClick={store.ui.toggleTheme}>
          <ListItemIcon>
            <Switch checked={store.ui.theme === 'dark'} />
          </ListItemIcon>
          <ListItemText>Dark Theme</ListItemText>
        </ListItem>
      </List>
    </>
  );
});
