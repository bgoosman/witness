import { Typography, Grid } from "@material-ui/core";
import React from "react";

interface TimelineEventData {
   description: string;
   youtube: string;
   date: string;
   relatedEvents: TimelineEventData[];
}

interface Props {
   events: TimelineEventData[];
}

interface TimelineHeaderProps {
   resultCount: number;
}

interface TimelineEventProps {
   event: TimelineEventData;
}

export const TimelineHeader = (props: TimelineHeaderProps) => (
   <div className="timeline-header">
      <Typography variant="h2">{props.resultCount} events</Typography>
   </div>
)

export const TimelineEvent = (props: TimelineEventProps) => {
   const { youtube, description } = props.event;

   return <div className="timeline-event">
      <iframe width="265" height="149" src={youtube} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>
      <Typography variant="body1">{description}</Typography>
   </div>
}

export const Timeline = (props: Props) => {
   const { events } = props;

   return (
      <div className="timeline">
         <TimelineHeader resultCount={events.length} />
         {events.map((event) => (
            <div className="timeline-row">
               <Typography variant="h6">{event.date}</Typography>
               <Grid container spacing={4}>
                  <Grid item>
                     <TimelineEvent event={event} />
                  </Grid>
                  {event.relatedEvents &&
                     event.relatedEvents.map((relatedEvent) => (
                        <Grid item>
                           <TimelineEvent event={relatedEvent} />
                        </Grid>
                     ))}
               </Grid>
            </div>
         ))}
      </div>
   );
}