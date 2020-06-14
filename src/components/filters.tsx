import React from 'react';
import { Grid, TextField, InputAdornment } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import { EventStore } from "../stores/event-store";

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

interface FiltersProps {
   eventStore: EventStore;
}

export const Filters = (props: FiltersProps) => {
   const classes = useStyles();
   const { eventStore } = props;

   const handleSearchTextChange = (event: any) => {
      console.log(event.target.value);
      eventStore.setSearchText(event.target.value);
   }

   return (
      <Grid container className={classes.root}>
         <form noValidate autoComplete="off">
            <TextField
               id="outlined-basic"
               fullWidth
               label="Search for words..."
               onChange={handleSearchTextChange}
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