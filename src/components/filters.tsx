import React from "react";
import { Grid, TextField, InputAdornment } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        border: '3px solid black',
        borderTop: 0,
        padding: '1rem 2rem',
        '& h3': {
            fontWeight: 800
        }
    }
});

export const Filters = () => {
   const classes = useStyles();
   return (
      <Grid container className={classes.root}>
         <form noValidate autoComplete="off">
            <TextField
               id="outlined-basic"
               fullWidth
               label="Search for words..." 
               variant="outlined"
               InputProps={{
                  endAdornment: ( 
                     <InputAdornment position="end">
                        <SearchIcon />
                     </InputAdornment>
                  ),
                  }}
            />
         </form>         
      </Grid>
   )
}