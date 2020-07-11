export interface TimelineEventData {
   id: string;
   city: string;
   date: string;
   description: string;
   relatedEvents: TimelineEventData[];
   state: string;
   timeOfDay: string;
   youtube: string;
}