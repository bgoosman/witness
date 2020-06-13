import { Component } from "react";
import { Typography } from "@material-ui/core";
import React from "react";

interface TimelineEvent {
   description: string;
}

interface Props {
   events: TimelineEvent[];
}

export class Timeline extends Component<Props> {
   render() {
      const { events } = this.props;

      return (
         events.map((event) => (
            <Typography variant="body1">{event.description}</Typography>
         ))
      );
   }
}