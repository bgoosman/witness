import React, { FunctionComponent } from 'react';
import { Grid, CssBaseline } from '@material-ui/core';
import { WitnessBanner } from './witness-banner';
import { Navigation } from './navigation';
import { makeStyles } from '@material-ui/core/styles';

interface AppLayoutProps {
   sidebar: any;
}

const useStyles = makeStyles(() => ({
   root: {
      flexGrow: 1,
   }
}));

export const AppLayout: FunctionComponent<AppLayoutProps> = ({ sidebar, children }) => {
   const classes = useStyles();
   return (
      <React.Fragment>
         <CssBaseline />
         <div className={classes.root}>
            <Grid container>
               <Grid item xs={3}>
                  <WitnessBanner />
                  {sidebar}
               </Grid>
               <Grid item xs={9}>
                  <Navigation />
                  {children}
               </Grid>
            </Grid>
         </div>
      </React.Fragment>
   );
};