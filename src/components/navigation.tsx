import React from "react"
import { AppBar, Toolbar } from "@material-ui/core";
import {
  Link
} from "react-router-dom";
import { makeStyles, styled, createMuiTheme } from '@material-ui/core/styles';

const myTheme = createMuiTheme();

const useStyles = makeStyles({
   root: {
   }
});

const MyLink = styled(Link)({
   ...myTheme.typography.button,
   color: 'black',
   fontSize: '1rem',
   marginLeft: '2rem',
   textDecoration: 'none',
   textTransform: 'uppercase'
});

export const Navigation = () => {
   const styles = useStyles();
   return (
      <AppBar 
         className={styles.root}
         color="transparent"
         position="static"
         elevation={0}>
         <Toolbar disableGutters={true}>
            <MyLink to="/">home</MyLink>
            <MyLink to="/about">about</MyLink>
         </Toolbar>
      </AppBar>
   );
}