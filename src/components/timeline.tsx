import React, { useState, useEffect } from 'react';
import { Observer } from 'mobx-react';
import { Typography, Grid, makeStyles } from "@material-ui/core";
import fetchJsonp from 'fetch-jsonp';
import LazyLoad from 'react-lazyload';

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

interface WidgetsJs {
   load: () => any;
   createTweet: (id: string, container: HTMLElement | null, options: any) => any;
}

interface TwitterJs {
   widgets: WidgetsJs;
}

declare global {
   var twttr: TwitterJs;
   var document: Document;
}

export const TimelineEvent = (props: TimelineEventProps) => {
   const { sourceLink } = props.event;
   const splitLink = sourceLink.split('/');
   const tweetId = splitLink[splitLink.length - 1];

   useEffect(() => {
      twttr.widgets.createTweet(
         tweetId,
         document.getElementById(`tweet-${tweetId}`),
         {
            conversation: 'none'
         }
      ).then(() => {
         console.log(`tweet-${tweetId} displayed`);
      });
   }, []);

   return <div className="timeline-event">
      <div id={`tweet-${tweetId}`}></div>
   </div>
}

export const YouTubeEvent = (props: TimelineEventProps) => {
   const { event } = props;
   const { youtube, description } = event;

   return <div className="timeline-event">
      <iframe width="350" height="196" src={event.youtube} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>
      <Typography variant="body1">{description}</Typography>
   </div>

}

export const Timeline = (props: TimelineProps) => {
   const { eventStore } = props;

   return (
      <Observer>
         {() => <div className={`timeline`}>
            <TimelineHeader resultCount={eventStore.filteredEvents.length} />
            {eventStore.filteredEvents.map((event) => (
               <div className="timeline-row" key={event.id}>
                  <Typography variant="h6">{event.date}</Typography>
                  <LazyLoad height={200} once>
                     <Grid container spacing={4}>
                        <Grid item>
                           {event.sourceLink && !event.youtube && <TimelineEvent event={event} />}
                           {event.sourceLink && event.youtube && <YouTubeEvent event={event} />}
                        </Grid>
                        {event.relatedEvents &&
                           event.relatedEvents.map((relatedEvent) => (
                              <Grid item key={relatedEvent.id}>
                                 <TimelineEvent event={relatedEvent} />
                              </Grid>
                           ))}
                     </Grid>
                  </LazyLoad>
               </div>
            ))}
            <TimelineFooter label="end of results" />
         </div>}
      </Observer>
   );
}