// src/utils/formatters.ts
import type { ActivityType } from '../types/Activity';

/**
 * Formats duration for display
 * @param duration - Duration in minutes
 * @returns Formatted duration string
 */
export function formatDuration(duration: number): string {
  if (duration < 60) {
    return `${duration} min`;
  } else {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (minutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  }
}

/**
 * Formats activity type for display
 * @param type - Activity type ('fun' or 'chores')
 * @returns Formatted type string
 */
export function formatActivityType(type: ActivityType): string {
  return type === 'chores' ? 'Productive Task' : 'Fun Activity';
}