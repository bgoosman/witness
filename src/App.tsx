import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';

import './App.css';
import { WitnessBanner } from './components/witness-banner';
import { Filters } from './components/filters';
import { Timeline } from './components/timeline';
import { RootStore } from './stores/root-store';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  }
}));

function App() {
  const classes = useStyles();
  const rootStore = new RootStore();
  const { eventStore } = rootStore;

  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.root}>
        <Grid container>
          <Grid item>
            <WitnessBanner />
            <Filters eventStore={eventStore} />
          </Grid>
          <Grid item>
            <Timeline eventStore={eventStore} />
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
}

export default App;
