import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';

import './App.css';
import { WitnessBanner } from './components/witness-banner';
import { Filters } from './components/filters';
import { Timeline } from './components/timeline';
import { RootStore } from './stores/root-store';
import { Navigation } from './components/navigation';
import { AboutPage } from './components/about';

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
    <Router>
      <CssBaseline />
      <div className={classes.root}>
        <Grid container>
          <Switch>
            <Route path="/about">
              <Grid item>
                <WitnessBanner />
              </Grid>
              <Grid item>
                <Navigation />
                <AboutPage />
              </Grid>
            </Route>
            <Route path="/">
              <Grid item>
                <WitnessBanner />
                <Filters eventStore={eventStore} />
              </Grid>
              <Grid item>
                <Navigation />
                <Timeline eventStore={eventStore} />
              </Grid>
            </Route>
          </Switch>
        </Grid>
      </div>
    </Router>
  );
}

export default App;
