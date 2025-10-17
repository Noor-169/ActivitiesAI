<!-- Test component to verify composables work -->
<template>
  <div>
    <h1>ActivityAI Vue Test</h1>
    
    <div v-if="isLoading">Loading activities...</div>
    <div v-else-if="error" class="error">Error: {{ error }}</div>
    
    <div v-else>
      <p>Total activities: {{ activities.length }}</p>
      <p>Filtered activities: {{ filteredActivities.length }}</p>
      
      <div>
        <label>
          Duration:
          <select v-model="filters.duration">
            <option value="any">Any</option>
            <option value="short">Short (1-15 min)</option>
            <option value="standard">Standard (15-30 min)</option>
            <option value="long">Long (30-60 min)</option>
            <option value="extended">Extended (60+ min)</option>
          </select>
        </label>
      </div>
      
      <div>
        <label>
          Type:
          <select v-model="filters.type">
            <option value="any">Any</option>
            <option value="fun">Fun</option>
            <option value="chores">Chores</option>
          </select>
        </label>
      </div>
      
      <button @click="getRandomActivity" :disabled="filteredActivities.length === 0">
        Get Random Activity
      </button>
      
      <div v-if="currentActivity" class="current-activity">
        <h3>{{ currentActivity.title }}</h3>
        <p><strong>Duration:</strong> {{ formatDuration(currentActivity.duration) }}</p>
        <p><strong>Type:</strong> {{ formatActivityType(currentActivity.type) }}</p>
        <p v-if="currentActivity.description">{{ currentActivity.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useActivities } from '../composables/useActivities'
import { useFilters } from '../composables/useFilters'
import { formatDuration, formatActivityType } from '../utils/formatters'
import type { Activity } from '../types/Activity'

// Initialize composables
const { 
  activities, 
  isLoading, 
  error, 
  loadActivities, 
  getRandomActivity: getRandomFromList 
} = useActivities()

const { filters, filteredActivities } = useFilters(activities)

// Current selected activity
const currentActivity = ref<Activity | null>(null)

// Get random activity from filtered results
const getRandomActivity = () => {
  const activity = getRandomFromList(filteredActivities.value)
  currentActivity.value = activity
}

// Load activities on component mount
onMounted(() => {
  loadActivities()
})
</script>

<style scoped>
.error {
  color: red;
  font-weight: bold;
}

.current-activity {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 4px;
  background-color: #f9f9f9;
}

label {
  display: block;
  margin: 0.5rem 0;
}

select {
  margin-left: 0.5rem;
  padding: 0.25rem;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}
</style>