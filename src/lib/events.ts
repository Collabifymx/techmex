import { isUpcoming } from "./utils";
import type { TechEvent } from "./types";

export const events: TechEvent[] = [];

export function upcomingEvents(list: TechEvent[] = events) {
  return list
    .filter((event) => isUpcoming(event.startsAt, event.endsAt))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export function pastEvents(list: TechEvent[] = events) {
  return list
    .filter((event) => !isUpcoming(event.startsAt, event.endsAt))
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));
}

export function eventCities(list: TechEvent[] = events) {
  return new Set(list.map((event) => event.city)).size;
}
