/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ChevronDown from 'mdi-material-ui/ChevronDown';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../store';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    whiteSpace: 'nowrap',
  },
}));

export default observer(
  ({ id, title, className, children }: React.PropsWithChildren<{ id: string; title: string; className?: string }>) => {
    const store = useStore();
    const classes = useStyles();
    return (
      <ExpansionPanel
        expanded={store.ui.sidePanelExpanded.has(id)}
        onChange={() => store.ui.toggleSidePanelExpansion(id)}
        className={className}
      >
        <ExpansionPanelSummary expandIcon={<ChevronDown />} aria-controls={id} id={id}>
          <Typography variant="h6" className={classes.header}>
            {title}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.root}>{children}</ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
);
