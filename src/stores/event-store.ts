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

interface TimelineGroup {
  date: string;
  events: Array<TimelineEventData>;
}

export class EventStore {
  @observable searchText: string = "";
  @observable allEvents: Array<TimelineEventData> = [];
  // apiHost: string = "https://tlnunh0fee.execute-api.us-east-1.amazonaws.com";
  apiHost: string = "";

  constructor() {
    this.loadAllEvents();
  }

  @computed({ keepAlive: true })
  get filteredEvents(): Array<TimelineEventData> {
    let result = this.allEvents;
    if (this.searchText) {
      result = result.filter((event: TimelineEventData) =>
        event.description.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    return result;
  }

  @computed({ keepAlive: true })
  get groupedEvents(): Array<TimelineGroup> {
    let result = this.filteredEvents;
    let group: TimelineGroup = {
      date: "",
      events: [],
    };
    const groups: Array<TimelineGroup> = [];
    result.forEach((event) => {
      if (event.date != group.date) {
        group = {
          date: event.date,
          events: [event],
        };
        groups.push(group);
      } else {
        group.events.push(event);
      }
    });
    return groups;
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
    fetch(`${this.apiHost}/dev/events?isTagged=true`, {
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
