import { EventStore } from './event-store';

export class RootStore {
   eventStore: EventStore;

   constructor(awsApiKey: string) {
      this.eventStore = new EventStore(awsApiKey);
   }
}