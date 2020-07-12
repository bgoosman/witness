import React from "react"
import { AppBar, Toolbar, Button } from "@material-ui/core";
import {
  Link
} from "react-router-dom";

export const Navigation = () => {
   return (
      <AppBar position="static">
         <Toolbar>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
         </Toolbar>
      </AppBar>
   );
}