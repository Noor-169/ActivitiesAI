<template>
  <section class="filters-section" aria-labelledby="filters-heading">
    <h2 id="filters-heading">Filter Activities</h2>
    
    <form 
      class="activity-filters" 
      role="search" 
      aria-label="Activity filters"
      @submit.prevent
    >
      <!-- Duration Filter -->
      <fieldset class="filter-group">
        <legend>Duration</legend>
        <div class="filter-options" role="group" aria-labelledby="duration-legend">
          <label 
            v-for="option in durationOptions" 
            :key="option.value"
            class="filter-option"
          >
            <input 
              type="radio" 
              :id="`duration-${option.value}`"
              :value="option.value"
              :checked="filters.duration === option.value"
              name="duration"
              @change="updateDuration(option.value)"
            >
            <span class="filter-label">{{ option.label }}</span>
            <span v-if="option.count !== undefined" class="filter-count">
              ({{ option.count }})
            </span>
          </label>
        </div>
      </fieldset>

      <!-- Activity Type Filter -->
      <fieldset class="filter-group">
        <legend>Activity Type</legend>
        <div class="filter-options" role="group" aria-labelledby="type-legend">
          <label 
            v-for="option in typeOptions" 
            :key="option.value"
            class="filter-option"
          >
            <input 
              type="radio" 
              :id="`type-${option.value}`"
              :value="option.value"
              :checked="filters.type === option.value"
              name="type"
              @change="updateType(option.value)"
            >
            <span class="filter-label">{{ option.label }}</span>
            <span v-if="option.count !== undefined" class="filter-count">
              ({{ option.count }})
            </span>
          </label>
        </div>
      </fieldset>

      <!-- Filter Summary & Actions -->
      <div class="filter-summary">
        <p class="available-count" role="status" aria-live="polite">
          {{ availableCount }} {{ availableCount === 1 ? 'activity' : 'activities' }} available
        </p>
        
        <div class="filter-actions">
          <button 
            type="button"
            class="button button-secondary"
            :aria-describedby="resetDescription"
            @click="handleReset"
          >
            Reset Filters
          </button>
          <span id="reset-description" class="sr-only">
            Clear all filters and show all activities
          </span>
        </div>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ActivityFilters } from '../types/Filters'
import type { ActivityType, DurationRange } from '../types/Activity'
import type { Activity } from '../types/Activity'

// Component Props
interface Props {
  filters: ActivityFilters
  availableCount: number
  activities?: Activity[]
}

// Component Events  
interface Emits {
  (e: 'update:filters', filters: ActivityFilters): void
  (e: 'reset'): void
}

// Define props
const props = withDefaults(defineProps<Props>(), {
  activities: () => []
})

// Define emits
const emit = defineEmits<Emits>()

// Duration filter options
const durationOptions = computed(() => {
  const baseOptions = [
    { value: 'any' as DurationRange, label: 'Any duration' },
    { value: 'short' as DurationRange, label: 'Short (1-15 min)' },
    { value: 'standard' as DurationRange, label: 'Standard (15-30 min)' },
    { value: 'long' as DurationRange, label: 'Long (30-60 min)' },
    { value: 'extended' as DurationRange, label: 'Extended (60+ min)' }
  ]

  // Add counts if activities are provided
  if (props.activities.length > 0) {
    return baseOptions.map(option => ({
      ...option,
      count: option.value === 'any' 
        ? props.activities.length
        : getActivityCountByDuration(option.value)
    }))
  }

  return baseOptions
})

// Type filter options
const typeOptions = computed(() => {
  const baseOptions = [
    { value: 'any' as ActivityType | 'any', label: 'Any type' },
    { value: 'fun' as ActivityType, label: 'Fun activities' },
    { value: 'chores' as ActivityType, label: 'Productive tasks' }
  ]

  // Add counts if activities are provided
  if (props.activities.length > 0) {
    return baseOptions.map(option => ({
      ...option,
      count: option.value === 'any' 
        ? props.activities.length
        : getActivityCountByType(option.value as ActivityType)
    }))
  }

  return baseOptions
})

// Helper functions to count activities
const getActivityCountByDuration = (duration: DurationRange): number => {
  return props.activities.filter(activity => {
    switch (duration) {
      case 'short':
        return activity.duration >= 1 && activity.duration <= 15
      case 'standard':
        return activity.duration > 15 && activity.duration <= 30
      case 'long':
        return activity.duration > 30 && activity.duration <= 60
      case 'extended':
        return activity.duration > 60
      default:
        return true
    }
  }).length
}

const getActivityCountByType = (type: ActivityType): number => {
  return props.activities.filter(activity => activity.type === type).length
}

// Event handlers
const updateDuration = (value: DurationRange): void => {
  emit('update:filters', {
    ...props.filters,
    duration: value
  })
}

const updateType = (value: ActivityType | 'any'): void => {
  emit('update:filters', {
    ...props.filters,
    type: value
  })
}

const handleReset = (): void => {
  emit('reset')
}

// Reset description for accessibility
const resetDescription = computed(() => {
  const hasActiveFilters = props.filters.duration !== 'any' || props.filters.type !== 'any'
  return hasActiveFilters 
    ? 'Clear all active filters and show all activities'
    : 'All filters are already cleared'
})
</script>

<style scoped>
.filters-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.filters-section h2 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.activity-filters {
  max-width: 800px;
  margin: 0 auto;
}

.filter-group {
  border: none;
  margin: 0 0 1.5rem 0;
  padding: 0;
}

.filter-group legend {
  font-weight: 600;
  color: #2d3748;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  padding: 0;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.filter-option {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  justify-content: center;
}

.filter-option:hover {
  background: #e8f4f8;
  border-color: #bee3f8;
}

.filter-option:has(input:checked) {
  background: #e6fffa;
  border-color: #4fd1c7;
  color: #234e52;
  font-weight: 500;
}

.filter-option input[type="radio"] {
  margin-right: 0.5rem;
  accent-color: #4fd1c7;
}

.filter-label {
  font-size: 0.95rem;
}

.filter-count {
  font-size: 0.85rem;
  color: #718096;
  margin-left: 0.25rem;
  font-weight: normal;
}

.filter-summary {
  background: #f7fafc;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid #e2e8f0;
  margin-top: 1.5rem;
}

.available-count {
  font-size: 1.1rem;
  color: #4a5568;
  margin-bottom: 1rem;
  font-weight: 500;
}

.filter-actions {
  display: flex;
  justify-content: center;
}

.button {
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button-secondary {
  background: #e2e8f0;
  color: #4a5568;
  border: 1px solid #cbd5e0;
}

.button-secondary:hover {
  background: #cbd5e0;
  color: #2d3748;
  transform: translateY(-1px);
}

.button-secondary:active {
  transform: translateY(0);
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
  .filters-section {
    padding: 1rem;
  }
  
  .filter-options {
    flex-direction: column;
    align-items: center;
  }
  
  .filter-option {
    min-width: 200px;
    max-width: 280px;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .filters-section h2 {
    font-size: 1.25rem;
  }
  
  .filter-option {
    padding: 0.625rem 0.875rem;
    min-width: auto;
    max-width: none;
  }
  
  .filter-label {
    font-size: 0.9rem;
  }
}

/* Focus styles for accessibility */
.filter-option:has(input:focus) {
  outline: 2px solid #4299e1;
  outline-offset: 2px;
}

.button:focus {
  outline: 2px solid #4299e1;
  outline-offset: 2px;
}
</style>