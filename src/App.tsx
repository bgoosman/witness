import React from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import { WitnessBanner } from './components/witness-banner';
import { Filters } from './components/filters';
import { Timeline } from './components/timeline';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  }
}));

const events = require('./events.json');

function App() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.root}>
        <Grid container>
          <Grid item>
            <WitnessBanner />
            <Filters />
          </Grid>
          <Grid item>
            <Timeline events={events} />
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
}

export default App;
