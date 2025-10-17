// src/utils/validators.ts
import type { Activity } from '../types/Activity';

/**
 * Validates if an object is a valid Activity
 * @param obj - Object to validate
 * @returns True if valid Activity, false otherwise
 */
export function isValidActivity(obj: any): obj is Activity {
  return (
    obj &&
    typeof obj.id === 'number' &&
    typeof obj.title === 'string' &&
    typeof obj.duration === 'number' &&
    (obj.type === 'fun' || obj.type === 'chores') &&
    (obj.description === undefined || typeof obj.description === 'string') &&
    (obj.difficulty === undefined || ['easy', 'medium', 'hard'].indexOf(obj.difficulty) !== -1) &&
    (obj.materials === undefined || Array.isArray(obj.materials))
  );
}

/**
 * Validates an array of activities
 * @param activities - Array to validate
 * @returns Array of valid activities
 */
export function validateActivities(activities: any[]): Activity[] {
  if (!Array.isArray(activities)) {
    return [];
  }
  
  return activities.filter(isValidActivity);
}