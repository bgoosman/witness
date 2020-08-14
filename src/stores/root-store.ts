import { EventStore } from './event-store';

export class RootStore {
   eventStore: EventStore;

   constructor(awsApiKey?: string, clientId?: string) {
      this.eventStore = new EventStore(awsApiKey, clientId);
   }
}