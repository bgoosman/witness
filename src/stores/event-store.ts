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
   awsApiKey?: string;

   constructor(awsApiKey?: string) {
      this.awsApiKey = awsApiKey;
   }

   @computed({ keepAlive: true })
   get filteredEvents(): Array<TimelineEventData> {
      let result = events;
      if (this.searchText) {
         result = events.filter((event: TimelineEventData) => {
            const relatedEvents = event.relatedEvents || [];
            const allEvents = [event].concat(relatedEvents);
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

   getUntaggedEvent() {
      return fetch('https://omswms4k5g.execute-api.us-east-1.amazonaws.com/default/getUntaggedWitnessLibraryEvent', {
         headers: {
            'x-api-key': this.awsApiKey || ''
         }
      }).then((response) => response.json());
   }

   putEvent(event: TimelineEventData) {
      console.log('putting new event');
      event.tagged = true;
      return fetch('https://5hrmoaurqi.execute-api.us-east-1.amazonaws.com/default/putWitnessLibraryEvent', {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.awsApiKey || ''
         },
         body: JSON.stringify(event)
      }).then((data) => {
         console.log('request succeeded', data);
      }).catch((error) => {
         console.log('request failed', error);
      });
   }
}