import { action, computed, observable } from "mobx";
import shortid from "shortid";

import { TimelineEventData } from "../models/timeline-event";

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

const events = addIds(require("../events.json"));

export class EventStore {
  @observable searchText: string = "";
  @observable allEvents: Array<TimelineEventData> = [];
  apiHost: string = "https://tlnunh0fee.execute-api.us-east-1.amazonaws.com";

  constructor() {
    this.loadAllEvents();
  }

  @computed({ keepAlive: true })
  get filteredEvents(): Array<TimelineEventData> {
    let result = this.allEvents;
    if (this.searchText) {
      result = events.filter((event: TimelineEventData) => {
        const relatedEvents = event.relatedEvents || [];
        const allEvents = [event].concat(relatedEvents);
        return allEvents.some((event: TimelineEventData) =>
          event.description.includes(this.searchText)
        );
      });
    }
    return result;
  }

  @action
  setSearchText(text: string): void {
    this.searchText = text;
  }

  getApiKey() {
    return window.localStorage.getItem("x-api-key");
  }

  getAuthHeaders() {
    return {
      "x-api-key": this.getApiKey() || "",
    };
  }

  loadAllEvents() {
    fetch(`${this.apiHost}/dev/events`, {
      headers: {
        ...this.getAuthHeaders(),
      },
    })
      .then((response) => response.json())
      .then((json) => {
        this.allEvents = json;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getUntaggedEvent() {
    return fetch(`${this.apiHost}/dev/events/random-untagged`, {
      headers: {
        ...this.getAuthHeaders(),
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
      });
  }

  putEvent(event?: TimelineEventData) {
    if (!event) return new Promise(() => {});
    console.log("putting new event", event);
    event.tagged = true;
    return fetch(`${this.apiHost}/dev/events/${event.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(event),
    })
      .then((data) => {
        console.log("request succeeded", data);
      })
      .catch((error) => {
        console.log("request failed", error);
      });
  }
}
