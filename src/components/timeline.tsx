import React, { useState, useEffect } from 'react';
import { Observer } from 'mobx-react';
import { Typography, Grid } from "@material-ui/core";
import fetchJsonp from 'fetch-jsonp';

import { TimelineEventData } from '../models/timeline-event';
import { EventStore } from "../stores/event-store";

interface Twitter {
   html: string;
}

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
   const { sourceLink } = props.event;
   const [twitter, setTwitter] = useState<Twitter | undefined>(undefined);

   const getTwitter = async (sourceLink: string) => {
      const url = `https://publish.twitter.com/oembed?url=${sourceLink}`;
      try {
         const response = await fetchJsonp(url);
         const json = await response.json();
         console.log(json)
         setTwitter(json);
      } catch(err) {
         setTwitter({
            'html': ''
         });
         console.log(err);
      }
   }
   useEffect(() => {
      if (!twitter) {
         getTwitter(sourceLink);
      }
   }, []);

   return <div className="timeline-event">
      <div dangerouslySetInnerHTML={{'__html': (twitter && twitter.html) || ''}}></div>
   </div>
}

export const Timeline = (props: TimelineProps) => {
   const { eventStore } = props;

   return (
      <Observer>
         {() => <div className="timeline">
            <TimelineHeader resultCount={eventStore.filteredEvents.length} />
            {eventStore.filteredEvents.map((event) => (
               <div className="timeline-row" key={event.id}>
                  <Typography variant="h6">{event.date}</Typography>
                  <Grid container spacing={4}>
                     <Grid item>
                        <TimelineEvent event={event} />
                     </Grid>
                     {event.relatedEvents &&
                        event.relatedEvents.map((relatedEvent) => (
                           <Grid item key={relatedEvent.id}>
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