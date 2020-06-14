import { EventStore } from './event-store';

export class RootStore {
   eventStore: EventStore;

   constructor() {
      this.eventStore = new EventStore();
   }
}