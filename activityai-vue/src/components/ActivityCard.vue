<template>
  <section class="activity-section" aria-labelledby="activity-heading">
    <h2 id="activity-heading">Your Activity Suggestion</h2>
    
    <div 
      class="activity-card" 
      role="region" 
      aria-live="polite" 
      :aria-label="currentActivityAriaLabel"
    >
      <!-- Loading State -->
      <div v-if="isLoading" class="activity-content">
        <div class="loading-message" role="status" aria-live="polite">
          <p>Finding the perfect activity for you...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="activity-content">
        <div class="error-message" role="alert" aria-live="assertive">
          <p>{{ error }}</p>
        </div>
      </div>

      <!-- Activity Display -->
      <div v-else-if="activity" class="activity-content">
        <div class="activity-title">{{ activity.title }}</div>
        <div class="activity-details">
          <span class="activity-badge activity-badge--duration">
            {{ formatDuration(activity.duration) }}
          </span>
          <span class="activity-badge activity-badge--type">
            {{ formatActivityType(activity.type) }}
          </span>
          <span 
            v-if="activity.difficulty" 
            class="activity-badge activity-badge--difficulty"
          >
            {{ formatDifficulty(activity.difficulty) }}
          </span>
        </div>
        <p v-if="activity.description" class="activity-description">
          {{ activity.description }}
        </p>
        <div v-if="activity.materials && activity.materials.length > 0" class="activity-materials">
          <strong>Materials needed:</strong>
          <ul>
            <li v-for="material in activity.materials" :key="material">
              {{ material }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Welcome State -->
      <div v-else class="activity-content">
        <div class="welcome-message">
          <p>Click "Get Activity" to discover something to do!</p>
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <button 
      type="button"
      class="button button-primary"
      :disabled="isLoading"
      :aria-describedby="buttonDescription"
      @click="handleGetActivity"
    >
      {{ isLoading ? 'Loading...' : 'Get Activity' }}
    </button>
    <span id="button-description" class="sr-only">
      Generate a new activity suggestion based on your current filters
    </span>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Activity } from '../types/Activity'
import { formatDuration, formatActivityType } from '../utils/formatters'

// Component Props
interface Props {
  activity?: Activity | null
  isLoading?: boolean
  error?: string | null
}

// Component Events
interface Emits {
  (e: 'get-activity'): void
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  activity: null,
  isLoading: false,
  error: null
})

// Define emits
const emit = defineEmits<Emits>()

// Computed properties
const currentActivityAriaLabel = computed(() => {
  if (props.activity) {
    return `Current activity: ${props.activity.title}, ${formatDuration(props.activity.duration)}, ${formatActivityType(props.activity.type)}`
  }
  return 'Activity suggestion area'
})

const buttonDescription = computed(() => {
  return props.isLoading 
    ? 'Loading new activity suggestion' 
    : 'Generate a new activity suggestion based on your current filters'
})

// Helper functions
const formatDifficulty = (difficulty: string): string => {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
}

// Event handlers
const handleGetActivity = (): void => {
  if (!props.isLoading) {
    emit('get-activity')
  }
}
</script>

<style scoped>
.activity-section {
  text-align: center;
  margin-bottom: 2rem;
}

.activity-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin: 1.5rem 0;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.3s ease;
}

.activity-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.activity-content {
  width: 100%;
}

.activity-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.activity-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.activity-badge {
  background: #e8f4f8;
  color: #2c5282;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #bee3f8;
}

.activity-badge--duration {
  background: #e6fffa;
  color: #234e52;
  border-color: #81e6d9;
}

.activity-badge--type {
  background: #fef5e7;
  color: #744210;
  border-color: #f6e05e;
}

.activity-badge--difficulty {
  background: #fed7d7;
  color: #742a2a;
  border-color: #fc8181;
}

.activity-description {
  font-size: 1.1rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.activity-materials {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  text-align: left;
}

.activity-materials strong {
  color: #2d3748;
  display: block;
  margin-bottom: 0.5rem;
}

.activity-materials ul {
  list-style-type: disc;
  margin-left: 1.5rem;
  margin: 0;
  padding-left: 1.5rem;
}

.activity-materials li {
  color: #4a5568;
  margin-bottom: 0.25rem;
}

.welcome-message {
  color: #718096;
  font-size: 1.2rem;
}

.loading-message {
  color: #4299e1;
  font-size: 1.1rem;
  font-weight: 500;
}

.error-message {
  color: #e53e3e;
  font-size: 1.1rem;
  font-weight: 500;
  background: #fed7d7;
  border: 1px solid #fc8181;
  border-radius: 8px;
  padding: 1rem;
}

.button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: none;
  min-width: 160px;
}

.button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.button:active:not(:disabled) {
  transform: translateY(0);
}

.button:disabled {
  background: #a0aec0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .activity-card {
    padding: 1.5rem;
    margin: 1rem 0;
  }
  
  .activity-title {
    font-size: 1.5rem;
  }
  
  .activity-details {
    flex-direction: column;
    align-items: center;
  }
  
  .button {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .activity-card {
    padding: 1rem;
  }
  
  .activity-title {
    font-size: 1.25rem;
  }
}
</style>