import React from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import { WitnessBanner } from './components/WitnessBanner';
import { Filters } from './components/Filters';
import { Navigation } from './components/Navigation';
import { Timeline } from './components/Timeline';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const events = [
  {
    description: 'Why must we dine on the tots?'
  }
];

function App() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={4}>
            <WitnessBanner />
            <Filters />
          </Grid>
          <Grid item xs={8}>
            <Navigation />
            <Timeline events={events} />
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
}

export default App;
