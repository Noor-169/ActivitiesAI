<template>
  <div class="app">
    <!-- Skip to main content link for accessibility -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <!-- Header -->
    <header role="banner" class="app-header">
      <h1>ActivityAI</h1>
      <p>Discover your next activity based on time and mood</p>
    </header>

    <!-- Main Content -->
    <main role="main" id="main-content" class="app-main">
      <!-- Activity Display -->
      <ActivityCard 
        :activity="currentActivity"
        :is-loading="isLoading"
        :error="error"
        @get-activity="handleGetActivity"
      />
      
      <!-- Activity Filters -->
      <ActivityFiltersComponent
        :filters="filters"
        :available-count="filteredActivities.length"
        :activities="activities"
        @update:filters="updateFilters"
        @reset="resetFilters"
      />
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <p>&copy; 2025 ActivityAI - Built with Vue 3 + TypeScript</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ActivityCard from './components/ActivityCard.vue'
import ActivityFiltersComponent from './components/ActivityFilters.vue'
import { useActivities } from './composables/useActivities'
import { useFilters } from './composables/useFilters'
import type { Activity } from './types/Activity'
import type { ActivityFilters } from './types/Filters'

// Initialize composables
const { 
  activities, 
  isLoading, 
  error, 
  loadActivities, 
  getRandomActivity,
  getActivityStats 
} = useActivities()

const { 
  filters, 
  filteredActivities, 
  resetFilters: resetFiltersComposable 
} = useFilters(activities as any)

// Current selected activity
const currentActivity = ref<Activity | null>(null)

// Event handlers
const handleGetActivity = async (): Promise<void> => {
  try {
    // Ensure activities are loaded
    if (activities.value.length === 0) {
      await loadActivities()
    }

    // Get random activity from filtered results
    const activity = getRandomActivity(filteredActivities.value)
    currentActivity.value = activity

    // Log statistics for debugging
    const stats = getActivityStats(filteredActivities.value)
    console.log('Filter results:', {
      total: filteredActivities.value.length,
      filters: filters.value,
      stats
    })

  } catch (err) {
    console.error('Error getting activity:', err)
  }
}

const updateFilters = (newFilters: ActivityFilters): void => {
  filters.value = newFilters
  
  // Clear current activity when filters change
  // This encourages users to get a new activity with new filters
  if (currentActivity.value) {
    currentActivity.value = null
  }

  console.log('Filters updated:', newFilters)
}

const resetFilters = (): void => {
  resetFiltersComposable()
  currentActivity.value = null
  console.log('Filters reset')
}

// Initialize the app
onMounted(async () => {
  console.log('ActivityAI Vue app initializing...')
  
  try {
    await loadActivities()
    const stats = getActivityStats()
    console.log('ActivityAI initialized successfully!', {
      totalActivities: activities.value.length,
      stats
    })
  } catch (err) {
    console.error('Failed to initialize app:', err)
  }
})
</script>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  color: #2c3e50;
  line-height: 1.6;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 6px;
}

.app-header {
  text-align: center;
  padding: 2rem 1rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.app-header h1 {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.app-header p {
  font-size: 1.2rem;
  color: #5a6c7d;
  font-weight: 400;
  max-width: 600px;
  margin: 0 auto;
}

.app-main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  width: 100%;
}

.app-footer {
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: #718096;
  font-size: 0.9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .app-header {
    padding: 1.5rem 1rem 0.5rem;
  }
  
  .app-header h1 {
    font-size: 2.5rem;
  }
  
  .app-header p {
    font-size: 1.1rem;
  }
  
  .app-main {
    padding: 1.5rem 1rem;
  }
}

@media (max-width: 480px) {
  .app-header h1 {
    font-size: 2rem;
  }
  
  .app-header p {
    font-size: 1rem;
  }
  
  .app-main {
    padding: 1rem 0.5rem;
  }
}

/* Focus indicators for accessibility */
:focus {
  outline: 2px solid #4299e1;
  outline-offset: 2px;
}

/* Selection styling */
::selection {
  background: rgba(102, 126, 234, 0.2);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Print styles */
@media print {
  .app {
    background: white;
  }
  
  .app-header {
    background: none;
    backdrop-filter: none;
  }
  
  .app-footer {
    background: none;
    backdrop-filter: none;
  }
}
</style>
