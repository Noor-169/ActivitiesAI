// src/composables/useFilters.ts
import { ref, computed, type Ref } from "vue";
import type { Activity } from "../types/Activity";
import type { ActivityFilters } from "../types/Filters";

export function useFilters(activities: Ref<Activity[]>) {
  const filters = ref<ActivityFilters>({
    duration: "any",
    type: "any",
  });

  const filteredActivities = computed(() => {
    let filtered = activities.value;

    // Apply duration filter
    if (filters.value.duration !== 'any') {
      filtered = filtered.filter(activity => {
        const duration = activity.duration;
        switch (filters.value.duration) {
          case 'short':
            return duration >= 1 && duration <= 15;
          case 'standard':
            return duration > 15 && duration <= 30;
          case 'long':
            return duration > 30 && duration <= 60;
          case 'extended':
            return duration > 60;
          default:
            return true;
        }
      });
    }

    // Apply type filter
    if (filters.value.type !== 'any') {
      filtered = filtered.filter(activity => activity.type === filters.value.type);
    }

    return filtered;
  });

  const resetFilters = () => {
    filters.value = { duration: "any", type: "any" };
  };

  return {
    filters,
    filteredActivities,
    resetFilters,
  };
}