// src/types/Filters.ts
import type { ActivityType, DurationRange } from './Activity';

export interface ActivityFilters {
  duration: DurationRange;
  type: ActivityType | "any";
}

export interface FilterOptions {
  durations: {
    value: DurationRange;
    label: string;
    range?: [number, number];
  }[];
  types: { value: ActivityType | "any"; label: string }[];
}