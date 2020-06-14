import React from "react"
import { AppBar, Toolbar, Button } from "@material-ui/core";

export const Navigation = () => {
   return (
      <AppBar position="static">
         <Toolbar>
            <Button>HOME</Button>
            <Button>ABOUT</Button>
            <Button>SUBMIT</Button>
            <Button>CONTACT</Button>
            <Button>SUPPORT</Button>
         </Toolbar>
      </AppBar>
   );
}