import { action, computed, observable } from 'mobx';
import shortid from 'shortid';

import { TimelineEventData } from '../models/timeline-event';

// TODO: When there is a real database storing events, they should
// have ids by default. For now, generate hashes of objects if there
// is no id.
function addIds(events: any[]): TimelineEventData[] {
   return events.map((event) => {
      return Object.assign({}, event, {
         id: event.id || shortid.generate(),
         relatedEvents: event.relatedEvents && addIds(event.relatedEvents),
      });
   });
}

const events = addIds(require('../events.json'));

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