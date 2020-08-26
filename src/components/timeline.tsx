import React, { useState, useEffect } from "react";
import { Observer } from "mobx-react";
import { Typography, Grid, makeStyles } from "@material-ui/core";
import fetchJsonp from "fetch-jsonp";
import LazyLoad from "react-lazyload";

import { TimelineEventData } from "../models/timeline-event";
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
);

interface TimelineFooterProps {
  label: string;
}

export const TimelineFooter = (props: TimelineFooterProps) => (
  <div className="timeline-footer">
    <Typography variant="h2">{props.label}</Typography>
  </div>
);

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
  const splitLink = sourceLink.split("/");
  const tweetId = splitLink[splitLink.length - 1];

  useEffect(() => {
    twttr.widgets
      .createTweet(tweetId, document.getElementById(`tweet-${tweetId}`), {
        conversation: "none",
      })
      .then(() => {
        console.log(`tweet-${tweetId} displayed`);
      });
  }, []);

  return (
    <div className="timeline-event">
      <div id={`tweet-${tweetId}`}></div>
    </div>
  );
};

export const YouTubeEvent = (props: TimelineEventProps) => {
  const { event } = props;
  const { youtubeEmbedLink, description } = event;

  return (
    <div className="timeline-event">
      <iframe
        width="350"
        height="196"
        src={event.youtubeEmbedLink}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
      <Typography variant="body1">{description}</Typography>
    </div>
  );
};

export const Timeline = (props: TimelineProps) => {
  const { eventStore } = props;

  return (
    <Observer>
      {() => (
        <div className={`timeline`}>
          <TimelineHeader resultCount={eventStore.filteredEvents.length} />
          {eventStore.groupedEvents.map((group) => (
            <div className="timeline-row" key={group.date}>
              <Typography variant="h6">{group.date}</Typography>
              {group.events.map((event) => (
                <React.Fragment key={`${group.date}-${event.id}`}>
                  <LazyLoad height={200} once>
                    <Grid container spacing={4}>
                      <Grid item>
                        {event.sourceLink && !event.youtubeEmbedLink && (
                          <TimelineEvent event={event} />
                        )}
                        {event.sourceLink && event.youtubeEmbedLink && (
                          <YouTubeEvent event={event} />
                        )}
                      </Grid>
                    </Grid>
                  </LazyLoad>
                </React.Fragment>
              ))}
            </div>
          ))}
          <TimelineFooter label="end of results" />
        </div>
      )}
    </Observer>
  );
};
