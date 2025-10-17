<template>
  <div class="app">
    <!-- Skip to main content link for accessibility -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <!-- Header -->
    <header role="banner" class="app-header">
      <h1>Wat ga je doen?</h1>
      <p></p>
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
} = useFilters(activities)

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
/* Global styles with ActivityAI Design System */

/* CSS Custom Properties - Peaceful & Joyous Theme */
:root {
  /* Colors - Peaceful & Joyous Palette */
  --color-primary: #4a90e2;        /* Calming sky blue */
  --color-primary-dark: #357abd;    /* Darker blue for contrast */
  --color-primary-light: #e3f0ff;  /* Very light blue background */
  
  --color-secondary: #7ed321;      /* Fresh, joyful green */
  --color-secondary-dark: #6bb018;  /* Darker green */
  --color-secondary-light: #f0fce8; /* Very light green */
  
  --color-accent: #f5a623;         /* Warm, cheerful orange */
  --color-accent-dark: #e09509;    /* Darker orange */
  --color-accent-light: #fff9ed;   /* Very light orange */
  
  /* Neutral Colors */
  --color-white: #ffffff;
  --color-gray-50: #fafafa;
  --color-gray-100: #f5f5f5;
  --color-gray-200: #eeeeee;
  --color-gray-300: #e0e0e0;
  --color-gray-400: #bdbdbd;
  --color-gray-500: #9e9e9e;
  --color-gray-600: #757575;
  --color-gray-700: #616161;
  --color-gray-800: #424242;
  --color-gray-900: #212121;
  
  /* Semantic Colors */
  --color-success: var(--color-secondary);
  --color-error: #e53e3e;
  --color-warning: var(--color-accent);
  --color-info: var(--color-primary);
  
  /* Typography */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-family-heading: var(--font-family-base);
  
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.25;
  --line-height-base: 1.5;
  --line-height-relaxed: 1.625;
  
  /* Spacing */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  
  /* Border Radius */
  --radius-sm: 0.25rem;   /* 4px */
  --radius: 0.5rem;       /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-full: 50%;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  
  /* Focus Ring */
  --focus-ring: 0 0 0 3px rgba(74, 144, 226, 0.3);
  --focus-ring-offset: 2px;
  
  /* Transitions */
  --transition-base: 150ms ease-in-out;
  --transition-colors: color 150ms ease-in-out, background-color 150ms ease-in-out, border-color 150ms ease-in-out;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-base);
  color: var(--color-gray-800);
  background-color: var(--color-gray-50);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: var(--color-white);
  text-align: center;
  padding: var(--space-8) var(--space-4);
  margin-bottom: var(--space-8);
  box-shadow: var(--shadow-md);
}

.app-header h1 {
  color: var(--color-white);
  margin-bottom: var(--space-2);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
}

.app-header p {
  color: rgba(255, 255, 255, 0.9);
  font-size: var(--font-size-lg);
  margin-bottom: 0;
  font-weight: var(--font-weight-light);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.app-main {
  flex: 1;
  max-width: 48rem; /* 768px - content-max-width from vanilla */
  margin: 0 auto;
  padding: 0 var(--space-4) var(--space-8);
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
