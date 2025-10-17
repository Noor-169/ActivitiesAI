<template>
  <section class="filters-section" aria-labelledby="filters-heading">
    <button 
      type="button"
      id="filters-heading"
      class="filters-header"
      :aria-expanded="isOpen"
      aria-controls="filters-content"
      :aria-label="`${isOpen ? 'Verberg' : 'Toon'} filteropties`"
      @click="toggleFilters"
    >
      <div class="header-content">
        <h2>Voorkeuren</h2>
        <span 
          v-if="!isOpen && hasActiveFilters" 
          class="active-filters-badge"
          :aria-label="`${activeFiltersCount} actieve filter${activeFiltersCount > 1 ? 's' : ''}`"
        >
          {{ activeFiltersCount }}
        </span>
      </div>
      <svg 
        class="chevron-icon"
        :class="{ 'chevron-rotated': isOpen }"
        width="20" 
        height="20" 
        viewBox="0 0 20 20" 
        fill="currentColor"
        aria-hidden="true"
      >
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
    
    <div 
      id="filters-content"
      class="filters-content"
      :class="{ 'filters-open': isOpen }"
    >
      <form 
        class="activity-filters" 
        role="search" 
        aria-label="Activity filters"
        @submit.prevent
      >
      <!-- Duration Filter -->
      <fieldset class="filter-group">
        <legend>Tijd</legend>
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
        <legend>Type</legend>
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
          {{ availableCount }} {{ availableCount === 1 ? 'activiteit' : 'activiteiten' }} beschikbaar
        </p>
        
        <div class="filter-actions">
          <button 
            type="button"
            class="button button-secondary"
            :aria-describedby="resetDescription"
            @click="handleReset"
          >
            Filters resetten
          </button>
          <span id="reset-description" class="sr-only">
            Zonder filters
          </span>
        </div>
      </div>
    </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ActivityFilters } from '../types/Filters'
import type { ActivityType, DurationRange } from '../types/Activity'
import type { Activity } from '../types/Activity'

// Collapsible state
const isOpen = ref(false)

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
    { value: 'any' as DurationRange, label: 'Elke tijdsduur' },
    { value: 'short' as DurationRange, label: 'Kort (1-15 min)' },
    { value: 'standard' as DurationRange, label: 'Standaard (15-30 min)' },
    { value: 'long' as DurationRange, label: 'Lang (30-60 min)' },
    { value: 'extended' as DurationRange, label: 'Dagdeel en meer (60+ min)' }
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

  return baseOptions.map(option => ({ ...option, count: undefined }))
})

// Type filter options
const typeOptions = computed(() => {
  const baseOptions = [
    { value: 'any' as ActivityType | 'any', label: 'Elk type' },
    { value: 'fun' as ActivityType, label: 'Vermaak' },
    { value: 'chores' as ActivityType, label: 'Productieve taakjes' }
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

  return baseOptions.map(option => ({ ...option, count: undefined }))
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

// Toggle dropdown function
const toggleFilters = (): void => {
  isOpen.value = !isOpen.value
}

// Active filters tracking
const hasActiveFilters = computed(() => {
  return props.filters.duration !== 'any' || props.filters.type !== 'any'
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (props.filters.duration !== 'any') count++
  if (props.filters.type !== 'any') count++
  return count
})

// Reset description for accessibility
const resetDescription = computed(() => {
  return hasActiveFilters.value 
    ? 'Clear all active filters and show all activities'
    : 'All filters are already cleared'
})
</script>

<style scoped>
.filters-section {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow);
  border: 1px solid var(--color-gray-200);
  padding: var(--space-8);
  margin-bottom: var(--space-8);
}

.filters-header {
  width: 100%;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
  transition: var(--transition-colors);
}

.filters-header:hover {
  opacity: 0.8;
}

.filters-header:focus {
  outline: none;
}

.filters-header:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius);
}

.chevron-icon {
  transition: transform 0.2s ease;
  color: var(--color-primary);
}

.chevron-rotated {
  transform: rotate(180deg);
}

.filters-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.2s ease;
  opacity: 0;
}

.filters-open {
  max-height: 1000px;
  opacity: 1;
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: 1;
}

.filters-header h2 {
  color: var(--color-primary);
  font-size: var(--font-size-2xl);
  margin: 0;
}

.active-filters-badge {
  background: var(--color-primary);
  color: var(--color-white);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  min-width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.activity-filters {
  max-width: 800px;
  margin: 0 auto;
}

.filter-group {
  border: none;
  margin: 0 0 var(--space-8) 0;
  padding: 0;
}

.filter-group:last-of-type {
  margin-bottom: var(--space-6);
}

.filter-group legend {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
  margin-bottom: var(--space-4);
  padding: 0;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.filter-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius);
  transition: var(--transition-colors);
  border: 2px solid transparent;
}

.filter-option:hover {
  background: var(--color-gray-100);
}

.filter-option:has(input:checked) {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
  color: var(--color-primary-dark);
  font-weight: var(--font-weight-medium);
}

.filter-option input[type="radio"] {
  margin-right: var(--space-3);
  width: 18px;
  height: 18px;
  accent-color: var(--color-primary);
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
  background: var(--color-white);
  color: var(--color-gray-700);
  border-color: var(--color-gray-300);
}

.button-secondary:hover {
  background: var(--color-gray-50);
  border-color: var(--color-gray-400);
  transform: translateY(-1px);
}

.button-secondary:active {
  transform: translateY(0);
}

.button-secondary:focus {
  outline: none;
}

.button-secondary:focus-visible {
  /* Only show focus outline for keyboard navigation (not mouse clicks) */
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
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
  /* Remove the extra outline on focus to avoid double borders */
  outline: none;
}

.filter-option input[type="radio"]:focus {
  /* Remove focus outline completely */
  outline: none;
}

.filter-option input[type="radio"]:focus-visible {
  /* Only show focus outline for keyboard navigation (not mouse clicks) */
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.button:focus {
  outline: 2px solid #4299e1;
  outline-offset: 2px;
}
</style>