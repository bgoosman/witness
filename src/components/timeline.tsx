import React, { useState, useEffect } from "react";
import { Observer } from "mobx-react";
import TwitterIcon from "@material-ui/icons/Twitter";
import {
  Typography,
  Grid,
  makeStyles,
  createStyles,
  Theme,
  Box,
  Paper,
  Link,
} from "@material-ui/core";
import LazyLoad from "react-lazyload";
import Linkify from "react-linkify";

import { TimelineEventData } from "../models/timeline-event";
import dayjs, { Dayjs } from "dayjs";
import dayjsPluginUTC from "dayjs/plugin/utc";
import dayjsPluginTimezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(dayjsPluginUTC);
dayjs.extend(dayjsPluginTimezone);
dayjs.extend(customParseFormat);

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    simpleTweet: {
      padding: "10px",
      width: "300px",
      "& p": {
        wordBreak: "break-word",
      },
    },
    youtubeEvent: {
      padding: "15px",
      width: "380px",
      "& p": {
        wordBreak: "break-word",
      },
    },
    timeline: {
      paddingLeft: "5rem",
    },
    timelineRow: {
      borderLeft: "2px solid black",
      padding: "0 3em 2em 3em",
    },
    timelineDate: {
      paddingBottom: "1rem",
    },
    timelineHeader: {
      padding: "0 3em 2em 3em",
      borderLeft: "2px solid black",
      position: "relative",
      color: "black",
      "&::after": {
        width: "60px",
        height: "8px",
        display: "block",
        top: "1.15rem",
        position: "absolute",
        left: "-32px",
        content: '""',
        border: "2px solid black",
        borderRadius: "7px",
        background: "white",
      },
    },
  })
);

export const TimelineHeader = (props: TimelineHeaderProps) => {
  const classes = useStyles();
  return (
    <div className={classes.timelineHeader}>
      <Typography variant="h4" component="h2">
        {props.resultCount} events
      </Typography>
    </div>
  );
};

interface TimelineFooterProps {
  label: string;
}

export const TimelineFooter = (props: TimelineFooterProps) => {
  const classes = useStyles();
  return (
    <div className={classes.timelineHeader}>
      <Typography variant="h4" component="h2">
        {props.label}
      </Typography>
    </div>
  );
};

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

  return <div id={`tweet-${tweetId}`}></div>;
};

export const EventDescription = (props: TimelineEventProps) => {
  const { city, date, description, state, time } = props.event;
  return (
    <>
      <Typography>
        <Linkify>{description}</Linkify>
      </Typography>
      <Typography variant="caption">
        {date} {city}, {state}
      </Typography>
    </>
  );
};

export const SimpleTweet = (props: TimelineEventProps) => {
  const { sourceLink } = props.event;
  const classes = useStyles();

  return (
    <Paper className={classes.simpleTweet}>
      <Link href={sourceLink}>
        <TwitterIcon />
      </Link>
      <EventDescription event={props.event} />
    </Paper>
  );
};

export const YouTubeEvent = (props: TimelineEventProps) => {
  const { youtubeEmbedLink } = props.event;
  const classes = useStyles();

  return (
    <LazyLoad once>
      <Paper className={classes.youtubeEvent}>
        <iframe
          width="350"
          height="196"
          src={youtubeEmbedLink}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
        <EventDescription event={props.event} />
      </Paper>
    </LazyLoad>
  );
};

export const Timeline = (props: TimelineProps) => {
  const { eventStore } = props;
  const classes = useStyles();

  return (
    <Observer>
      {() => (
        <div className={classes.timeline}>
          <TimelineHeader resultCount={eventStore.filteredEvents.length} />
          {eventStore.groupedEvents.map((group) => (
            <Grid container key={group.date} className={classes.timelineRow}>
              <Typography variant="h3" className={classes.timelineDate}>
                {group.date}
              </Typography>
              <Grid container spacing={2}>
                {group.events.map((event) => (
                  <Grid item key={`${group.date}-${event.id}`}>
                    {event.sourceLink && !event.youtubeEmbedLink && (
                      <SimpleTweet event={event} />
                    )}
                    {event.sourceLink && event.youtubeEmbedLink && (
                      <YouTubeEvent event={event} />
                    )}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
          <TimelineFooter label="end of results" />
        </div>
      )}
    </Observer>
  );
};
