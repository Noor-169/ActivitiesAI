import { ref, readonly } from "vue";
import type { Activity } from "../types/Activity";
import { validateActivities } from "../utils/validators";

export function useActivities() {
  const activities = ref<Activity[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const loadActivities = async (): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await fetch(`${import.meta.env.BASE_URL}data/activities.json`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch activities: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validate the data structure
      if (!data || !Array.isArray(data.activities)) {
        throw new Error('Invalid activities data structure');
      }

      // Validate activities using the validator utility
      const validActivities = validateActivities(data.activities);
      activities.value = validActivities;
      
      if (validActivities.length === 0) {
        throw new Error('No valid activities found');
      }

    } catch (err) {
      console.error('Error loading activities:', err);
      error.value = err instanceof Error ? err.message : 'Failed to load activities';
      
      // Fallback activities in case of network failure
      activities.value = getFallbackActivities();
    } finally {
      isLoading.value = false;
    }
  };

  const getRandomActivity = (filteredActivities: Activity[]): Activity | null => {
    if (!filteredActivities || filteredActivities.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredActivities.length);
    return filteredActivities[randomIndex] ?? null;
  };

  // Fallback activities for offline or error scenarios
  const getFallbackActivities = (): Activity[] => [
    {
      id: 1,
      title: "Take a deep breath",
      duration: 2,
      type: "fun",
      description: "Take a moment to breathe deeply and center yourself"
    },
    {
      id: 2,
      title: "Stretch for 5 minutes",
      duration: 5,
      type: "fun",
      description: "Do some simple stretches to relax your body"
    },
    {
      id: 3,
      title: "Tidy up your workspace",
      duration: 10,
      type: "chores",
      description: "Organize your immediate surroundings"
    }
  ];

  // Get statistics about activities
  const getActivityStats = (activitiesToAnalyze: Activity[] = activities.value) => {
    const total = activitiesToAnalyze.length;
    const funCount = activitiesToAnalyze.filter(a => a.type === 'fun').length;
    const choresCount = activitiesToAnalyze.filter(a => a.type === 'chores').length;
    
    const durations = {
      short: activitiesToAnalyze.filter(a => a.duration >= 1 && a.duration <= 15).length,
      standard: activitiesToAnalyze.filter(a => a.duration > 15 && a.duration <= 30).length,
      long: activitiesToAnalyze.filter(a => a.duration > 30 && a.duration <= 60).length,
      extended: activitiesToAnalyze.filter(a => a.duration > 60).length,
    };

    return {
      total,
      byType: { fun: funCount, chores: choresCount },
      byDuration: durations
    };
  };

  return {
    activities: readonly(activities),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadActivities,
    getRandomActivity,
    getActivityStats,
  };
}