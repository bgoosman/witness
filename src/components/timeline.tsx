import React from 'react';
import { Observer } from 'mobx-react';
import { Typography, Grid } from "@material-ui/core";

import { TimelineEventData } from '../models/timeline-event';
import { EventStore } from "../stores/event-store";

interface TimelineProps {
   eventStore: EventStore;
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

interface TimelineFooterProps {
   label: string;
}

export const TimelineFooter = (props: TimelineFooterProps) => (
   <div className="timeline-footer">
      <Typography variant="h2">{props.label}</Typography>
   </div>
)

export const TimelineEvent = (props: TimelineEventProps) => {
   const { city, description, state, timeOfDay, youtube } = props.event;

   return <div className="timeline-event">
      <iframe width="265" height="149" src={youtube} title="YouTube video" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>
      <Typography variant="body1">{description}{timeOfDay && ` // ${timeOfDay}`}{city && ` // ${city}`}{state && ` // ${state}`}</Typography>
   </div>
}

export const Timeline = (props: TimelineProps) => {
   const { eventStore } = props;

   return (
      <Observer>
         {() => <div className="timeline">
            <TimelineHeader resultCount={eventStore.filteredEvents.length} />
            {eventStore.filteredEvents.map((event) => (
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
            <TimelineFooter label="end of results" />
         </div>}
      </Observer>
   );
}