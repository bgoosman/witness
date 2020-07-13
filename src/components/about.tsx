import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
   root: {
      padding: '1rem',
      '& p': {
         padding: '1rem'
      }
   }
});

export const AboutPage = () => {
   const classes = useStyles();
   return (
      <div className={classes.root}>
         <Typography variant="body1">Witness Library is an independent initiative archiving citizen journalism in a searchable database.</Typography>
         <Typography variant="body1">Nowadays, the on-the-ground citizen can capture historical footage that helps us understand a situation. Everyone has a smartphone, and everyone can hold someone accountable.</Typography>
         <Typography variant="body1">Recently, citizen journalism about police brutality and protests has flooded social media, and we wondered how would historians, journalists, even interested citizens in the future search for these videos taken of ongoing protests and events and police brutality? History is being made, and it’s being documented across people’s phones and social media like Twitter and Facebook. But finding specific videos is an arduous task. What ends up being archived and searchable later is the article that, say, NYTimes wrote about the select videos that they decided were important. This seems like a huge missed potential. Here, at Witness Library, we’re trying to  consolidate these efforts and become a place where people know to submit their footage so we can have a fuller picture of historical events as documented on the ground.</Typography>
         <Typography variant="body1">What if you could ask “What was the Mission area like on June 2, 2020?” and see a timeline of videos from morning to night and see how the protest escalated and how things changed at nighttime. Or “What incidences of police brutality happened in NYC on {this} week?” and see the proof and the evidence right there.</Typography>
         <Typography variant="body1">We probably have enough content to reconstruct entire events if historians wanted access to primary sources, etc. If we can build up a database of this footage and this information, we can redistribute power to document among citizens. Perhaps it will help journalists, lawyers, historians, and others process the events that are happening today.</Typography>
         <Typography variant="body1">We aim to be a place that helps develop and aid both traditional and citizen journalism efforts.</Typography>
      </div>
   );
};