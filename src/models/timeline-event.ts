import { Dayjs } from 'dayjs';
export interface TimelineEventData {
   id: string;
   groupId: string;
   doucetteId: string;
   city: string;
   state: string;
   date: string;
   timeOfDay: string;
   description: string;
   relatedEvents?: TimelineEventData[];
   sourceLink: string;
   youtube: string;
   tagged: boolean;
}