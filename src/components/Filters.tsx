import React from "react";
import { Component } from "react";
import { Grid, TextField, InputAdornment } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';

export class Filters extends Component {
   render() {
      return (
         <Grid container>
            <form noValidate autoComplete="off">
               <TextField
                  id="outlined-basic"
                  fullWidth
                  label="Search post containing the words..." 
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
}