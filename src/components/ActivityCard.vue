<template>
  <section class="activity-section" aria-labelledby="activity-heading">
    <h2 id="activity-heading"></h2>
    
    <div 
      class="activity-card" 
      role="region" 
      aria-live="polite" 
      :aria-label="currentActivityAriaLabel"
    >
      <!-- Loading State -->
      <div v-if="isLoading" class="activity-content">
        <div class="loading-message" role="status" aria-live="polite">
          <p>Zoekt...</p>
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
          <!-- <span 
            v-if="activity.difficulty" 
            class="activity-badge activity-badge--difficulty"
          >
            {{ formatDifficulty(activity.difficulty) }}
          </span> -->
        </div>
        <p v-if="activity.description" class="activity-description">
          {{ activity.description }}
        </p>
        <div v-if="activity.materials && activity.materials.length > 0" class="activity-materials">
          <strong>wat heb je nodig:</strong>
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
          <p>Klik hieronder voor een suggestie</p>
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
      {{ isLoading ? 'Loading...' : 'Geef me iets te doen!' }}
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
// const formatDifficulty = (difficulty: string): string => {
//   return difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
// }

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
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-gray-200);
  text-align: center;
  margin-bottom: var(--space-6);
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: var(--transition-base);
}

.activity-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-accent) 100%);
}

.activity-card:hover {
  box-shadow: var(--shadow-lg);
}

.activity-content {
  width: 100%;
}

.activity-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-dark);
  margin-bottom: var(--space-4);
  line-height: var(--line-height-tight);
}

.activity-details {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  justify-content: center;
  margin-bottom: var(--space-4);
}

.activity-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-2) var(--space-4);
  background: var(--color-gray-100);
  color: var(--color-gray-700);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.activity-badge--duration {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.activity-badge--type {
  background: var(--color-secondary-light);
  color: var(--color-secondary-dark);
}

.activity-badge--difficulty {
  background: var(--color-accent-light);
  color: var(--color-accent-dark);
}

.activity-description {
  color: var(--color-gray-600);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  margin-bottom: 0;
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
  color: var(--color-gray-500);
  font-size: var(--font-size-xl);
  font-style: italic;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-16);
  margin: var(--space-8) 0; /* Added margin around the button */
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  border-radius: var(--radius-xl);
  border: 2px solid transparent;
  cursor: pointer;
  text-decoration: none;
  transition: var(--transition-colors), transform 150ms ease-in-out;
  min-height: 44px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: var(--color-white);
  box-shadow: var(--shadow-lg);
}

.button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg), 0 0 20px rgba(74, 144, 226, 0.3);
}

.button:active:not(:disabled) {
  transform: translateY(0);
}

.button:disabled {
  background: var(--color-gray-400);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
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
/* Medium devices (tablets, 768px and up) - Enhancement for larger screens */
@media (min-width: 48rem) {
  .activity-card {
    padding: var(--space-12);
    min-height: 240px;
  }
}

/* Mobile devices (smaller screens) - Reduction for mobile */
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