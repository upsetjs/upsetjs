/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ChevronDown from 'mdi-material-ui/ChevronDown';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
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
      <Accordion
        expanded={store.ui.sidePanelExpanded.has(id)}
        onChange={useCallback(() => store.ui.toggleSidePanelExpansion(id), [store, id])}
        className={className}
      >
        <AccordionSummary expandIcon={<ChevronDown />} aria-controls={id} id={id}>
          <Typography variant="h6" className={classes.header}>
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.root}>{children}</AccordionDetails>
      </Accordion>
    );
  }
);
