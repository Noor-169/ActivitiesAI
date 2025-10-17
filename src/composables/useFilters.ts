// src/composables/useFilters.ts
import { ref, computed, watch, type Ref } from "vue";
import type { Activity } from "../types/Activity";
import type { ActivityFilters } from "../types/Filters";

const STORAGE_KEY = 'activityai-filters';

// Load filters from localStorage
function loadFiltersFromStorage(): ActivityFilters {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as ActivityFilters;
      // Validate the stored data
      if (parsed && typeof parsed === 'object' && 'duration' in parsed && 'type' in parsed) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to load filters from localStorage:', error);
  }
  
  return { duration: "any", type: "any" };
}

// Save filters to localStorage
function saveFiltersToStorage(filters: ActivityFilters): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.warn('Failed to save filters to localStorage:', error);
  }
}

export function useFilters(activities: Ref<readonly Activity[]>) {
  const filters = ref<ActivityFilters>(loadFiltersFromStorage());

  const filteredActivities = computed(() => {
    let filtered = [...activities.value];

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

  // Watch for filter changes and persist to localStorage
  watch(filters, (newFilters) => {
    saveFiltersToStorage(newFilters);
  }, { deep: true });

  return {
    filters,
    filteredActivities,
    resetFilters,
  };
}