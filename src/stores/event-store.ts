import { action, computed, observable } from 'mobx';

import { TimelineEventData } from '../models/timeline-event';

// TODO: When there is a real database storing events, they should
// have ids by default. For now, generate hashes of objects if there
// is no id.
function rawEventToEvent(rawEvents: any[]): TimelineEventData[] {
   const stringHash = (s: string) => {
      let hash = 0, i, chr;
      for (i = 0; i < s.length; i++) {
         chr   = s.charCodeAt(i);
         hash  = ((hash << 5) - hash) + chr;
         hash |= 0; // Convert to 32bit integer
      }
      return JSON.stringify(hash);
   };

   return rawEvents.map((rawEvent) => {
      return Object.assign({}, rawEvent, {
         id: rawEvent.id || stringHash(JSON.stringify(rawEvent)),
         relatedEvents: rawEvent.relatedEvents && rawEventToEvent(rawEvent.relatedEvents),
      });
   });
}

const events = rawEventToEvent(require('../events.json'));

export class EventStore {
   @observable searchText: string = '';

   @computed({ keepAlive: true })
   get filteredEvents(): Array<TimelineEventData> {
      let result = events;
      if (this.searchText) {
         result = events.filter((event: TimelineEventData) => {
            const allEvents = [event].concat(event.relatedEvents);
            return allEvents.some((event: TimelineEventData) =>
               event.description.includes(this.searchText)
            )
         });
      }
      return result;
   }

   @action
   setSearchText(text: string): void {
      this.searchText = text;
   }
}