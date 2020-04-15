import React from 'react';
import { observer } from 'mobx-react-lite';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronLeftIcon from 'mdi-material-ui/ChevronLeft';

export default observer(() => {
  return (
    <>
      <List>
        {['All mail', 'Trash', 'Spam'].map((text) => (
          <ListItem button key={text}>
            <ListItemIcon>
              <ChevronLeftIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </>
  );
});
