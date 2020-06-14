import { action, computed, observable } from 'mobx';

import { TimelineEventData } from '../models/timeline-event';
const events = require('../events.json');

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