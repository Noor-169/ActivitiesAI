# ActivityAI - Implementation Plan

## Project Overview

A lightweight activity suggestion app using vanilla JavaScript, HTML, and CSS. Activities are stored in a static JSON file with filtering capabilities for duration and type (fun/chores).

## Architecture Overview

### File Structure

```
ActivityAI/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Main stylesheet
├── js/
│   ├── app.js          # Main application logic
│   ├── storage.js      # Data loading and management
│   └── filters.js      # Filtering functionality
├── data/
│   └── activities.json # Activity database
├── README.md           # Documentation
├── initial.md          # Product requirements
├── claude.md           # Development guidelines
└── planning.md         # This file
└── task.md         # This file
```

## Data Structure Design

### Activity Object Schema

```javascript
{
  "id": 0, // type: number
  "title": "Activity Name",
  "duration": 30,           // in minutes
  "type": "fun",           // "fun" or "chores"
  "description": "Optional description",
  "difficulty": "easy",    // "easy", "medium", "hard" (optional)
  "materials": []          // Array of required materials (optional)
}
```

### Duration Categories

- **Short (1-15 min)**: Short activities
- **Standard (15-30 min)**: Standard activities
- **Long (30-60 min)**: Long activities
- **Extended (60+ min)**: Long-term activities
- **Day- or Multi-Day **:

## Implementation Phases

### Phase 1: Core Foundation (MVP)

**Goal**: Basic working application with activity display and filtering

#### 1.1 HTML Structure

- Create semantic HTML structure
- Include accessibility attributes (ARIA labels, proper headings)
- Mobile-responsive viewport meta tag
- Basic form elements for filters

#### 1.2 CSS Framework

- Mobile-first responsive design
- Clean, minimalist styling
- High contrast for accessibility
- Focus indicators for keyboard navigation
- CSS custom properties for theming

#### 1.3 JavaScript Core

- ES6 module structure
- Error handling wrapper functions
- Basic activity loading from JSON
- Random activity selection
- Simple filtering logic

#### 1.4 Initial Data

- Create 30+ diverse activities
- Even distribution across duration ranges
- Balance of fun activities and chores
- Include optional fields for some activities

### Phase 2: Framework Migration (Vue + TypeScript)

**Goal**: Convert vanilla JavaScript application to Vue 3 with TypeScript for improved maintainability, type safety, and scalability

#### Migration Rationale

**Current Limitations:**

- Manual DOM manipulation becomes complex as features grow
- No type safety leading to potential runtime errors
- State management scattered across modules
- No component reusability
- Difficult to test individual pieces of functionality
- No built-in reactivity system

**Benefits of Vue + TypeScript:**

- **Type Safety**: Catch errors at compile time, better IDE support
- **Component Architecture**: Reusable, testable components
- **Reactive State Management**: Automatic UI updates when data changes
- **Better Developer Experience**: Vue DevTools, hot reload, better debugging
- **Scalability**: Easier to add complex features like user preferences, history
- **Modern Tooling**: Vite for fast builds, ESLint/Prettier integration
- **Future-Proof**: Industry standard approach for modern web applications

#### 2.1 Project Setup & Tooling

**Development Environment:**

```bash
# Initialize Vue 3 + TypeScript project with Vite
npm create vue@latest activityai-vue
# Options to select:
# ✅ TypeScript
# ✅ PWA (for future offline support)
# ✅ Vitest (for unit testing)
# ✅ ESLint + Prettier
# ❌ Router (not needed for single page)
# ❌ Pinia (start simple, add if needed)
```

**Project Structure:**

```
ActivityAI-Vue/
├── public/
│   └── data/
│       └── activities.json     # Moved from src to public
├── src/
│   ├── components/
│   │   ├── ActivityCard.vue    # Display component
│   │   ├── ActivityFilters.vue # Filter controls
│   │   └── LoadingSpinner.vue  # Loading state
│   ├── composables/
│   │   ├── useActivities.ts    # Activity data management
│   │   ├── useFilters.ts       # Filter logic
│   │   └── useLocalStorage.ts  # Persistence (future)
│   ├── types/
│   │   ├── Activity.ts         # Type definitions
│   │   └── Filters.ts          # Filter types
│   ├── utils/
│   │   ├── formatters.ts       # Duration/type formatting
│   │   └── validators.ts       # Data validation
│   ├── App.vue                 # Main application
│   ├── main.ts                 # Application entry point
│   └── style.css              # Migrated styles
├── index.html                  # Vite entry point
├── vite.config.ts             # Build configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

#### 2.2 Type Definitions

**Activity Types:**

```typescript
// src/types/Activity.ts
export interface Activity {
  id: number;
  title: string;
  duration: number; // minutes
  type: "fun" | "chores";
  description?: string;
  difficulty?: "easy" | "medium" | "hard";
  materials?: string[];
}

export type ActivityType = Activity["type"];
export type DurationRange = "any" | "short" | "standard" | "long" | "extended";

// src/types/Filters.ts
export interface ActivityFilters {
  duration: DurationRange;
  type: ActivityType | "any";
}

export interface FilterOptions {
  durations: {
    value: DurationRange;
    label: string;
    range?: [number, number];
  }[];
  types: { value: ActivityType | "any"; label: string }[];
}
```

#### 2.3 Composables (Business Logic)

**Activity Management:**

```typescript
// src/composables/useActivities.ts
import { ref, computed } from "vue";
import type { Activity } from "@/types/Activity";

export function useActivities() {
  const activities = ref<Activity[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const loadActivities = async () => {
    // Fetch logic with proper error handling
  };

  const getRandomActivity = (filteredActivities: Activity[]) => {
    // Random selection logic
  };

  return {
    activities: readonly(activities),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadActivities,
    getRandomActivity,
  };
}
```

**Filter Management:**

```typescript
// src/composables/useFilters.ts
import { ref, computed } from "vue";
import type { ActivityFilters, Activity } from "@/types";

export function useFilters(activities: Ref<Activity[]>) {
  const filters = ref<ActivityFilters>({
    duration: "any",
    type: "any",
  });

  const filteredActivities = computed(() => {
    // Reactive filtering logic
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
```

#### 2.4 Vue Components

**Main Application:**

```vue
<!-- src/App.vue -->
<template>
  <div class="app">
    <header class="app-header">
      <h1>ActivityAI</h1>
      <p>Discover your next activity based on time and mood</p>
    </header>

    <main class="app-main">
      <ActivityCard
        :activity="currentActivity"
        :is-loading="isLoading"
        :error="error"
        @get-activity="handleGetActivity"
      />

      <ActivityFilters
        v-model:filters="filters"
        :available-count="filteredActivities.length"
        @reset="resetFilters"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ActivityCard from "@/components/ActivityCard.vue";
import ActivityFilters from "@/components/ActivityFilters.vue";
import { useActivities } from "@/composables/useActivities";
import { useFilters } from "@/composables/useFilters";

// Component logic with full type safety
</script>
```

**Activity Display Component:**

```vue
<!-- src/components/ActivityCard.vue -->
<template>
  <section class="activity-section" aria-labelledby="activity-heading">
    <h2 id="activity-heading">Your Activity Suggestion</h2>

    <div class="activity-card" role="region" aria-live="polite">
      <LoadingSpinner v-if="isLoading" />

      <div v-else-if="error" class="error-message" role="alert">
        {{ error }}
      </div>

      <div v-else-if="activity" class="activity-content">
        <div class="activity-title">{{ activity.title }}</div>
        <div class="activity-details">
          <span class="activity-badge activity-badge--duration">
            {{ formatDuration(activity.duration) }}
          </span>
          <span class="activity-badge activity-badge--type">
            {{ formatActivityType(activity.type) }}
          </span>
        </div>
        <p v-if="activity.description" class="activity-description">
          {{ activity.description }}
        </p>
      </div>

      <div v-else class="welcome-message">
        Click "Get Activity" to discover something to do!
      </div>
    </div>

    <button
      @click="$emit('get-activity')"
      :disabled="isLoading"
      class="button button-primary"
      type="button"
    >
      {{ isLoading ? "Loading..." : "Get Activity" }}
    </button>
  </section>
</template>

<script setup lang="ts">
import type { Activity } from "@/types/Activity";
import { formatDuration, formatActivityType } from "@/utils/formatters";

interface Props {
  activity?: Activity;
  isLoading?: boolean;
  error?: string | null;
}

defineProps<Props>();
defineEmits<{
  "get-activity": [];
}>();
</script>
```

#### 2.5 Migration Strategy

**Phase 1: Setup & Structure**

1. Create new Vue project alongside existing vanilla JS version
2. Set up TypeScript configuration and build tools
3. Define all types and interfaces
4. Create basic component structure

**Phase 2: Logic Migration**

1. Convert vanilla JS modules to Vue composables
2. Migrate utility functions with proper typing
3. Implement reactive state management
4. Port error handling logic

**Phase 3: Component Implementation**

1. Build ActivityCard component with props/events
2. Create ActivityFilters component with v-model
3. Implement LoadingSpinner and error states
4. Add accessibility attributes and ARIA labels

**Phase 4: Styling & Polish**

1. Migrate existing CSS to Vue component styles
2. Implement CSS modules or scoped styles
3. Ensure responsive design works with new structure
4. Add transitions and micro-interactions

**Phase 5: Testing & Validation**

1. Write unit tests for composables and utilities
2. Component testing with Vue Test Utils
3. E2E testing for user workflows
4. Accessibility testing with new structure
5. Performance comparison with vanilla version

#### 2.6 Testing Strategy

**Unit Testing:**

```typescript
// tests/composables/useFilters.test.ts
import { describe, it, expect } from "vitest";
import { useFilters } from "@/composables/useFilters";

describe("useFilters", () => {
  it("filters activities by duration correctly", () => {
    // Type-safe testing with proper mocks
  });
});
```

**Component Testing:**

```typescript
// tests/components/ActivityCard.test.ts
import { mount } from "@vue/test-utils";
import ActivityCard from "@/components/ActivityCard.vue";

describe("ActivityCard", () => {
  it("displays activity information correctly", () => {
    // Component behavior testing
  });
});
```

#### 2.7 Migration Benefits

**Immediate Benefits:**

- Type safety prevents runtime errors
- Better IDE support and autocomplete
- Component isolation makes testing easier
- Reactive updates eliminate manual DOM manipulation

**Long-term Benefits:**

- Easier to add complex features (user accounts, preferences)
- Component reusability for future features
- Better maintainability as team grows
- Industry-standard development practices

**Performance Considerations:**

- Bundle size will increase (~50KB for Vue + TypeScript)
- Build step required (but provides optimization)
- Development server with hot reload
- Better runtime performance due to reactive system

#### 2.8 Risk Mitigation

**Potential Risks:**

- Learning curve for team members new to Vue/TypeScript
- Increased complexity for a simple application
- Build tool dependency

**Mitigation Strategies:**

- Gradual migration approach (both versions can coexist)
- Comprehensive documentation and training
- Fallback plan to vanilla JS if migration fails
- Thorough testing at each migration step

#### 2.9 Success Criteria

**Technical Criteria:**

- [ ] All existing functionality works identically
- [ ] Type safety covers 100% of codebase
- [ ] Build process completes without errors
- [ ] Performance matches or exceeds vanilla version
- [ ] Test coverage > 80%

**User Experience Criteria:**

- [ ] No regression in accessibility features
- [ ] Identical user interface and interactions
- [ ] Same or better loading times
- [ ] Error handling improvements
- [ ] Smooth transitions and interactions

### Phase 3: Enhanced Filtering

**Goal**: Robust filtering system with user-friendly interface (using Vue components)

#### 3.1 Filter UI Components

- Duration range slider/selector
- Activity type toggle buttons
- Clear/reset filters button
- Visual feedback for active filters

#### 3.2 Advanced Filtering Logic

- Combine multiple filter criteria
- Fallback when no activities match filters
- Filter state management
- URL parameter support for sharing (future enhancement)

### Phase 4: User Experience Polish

**Goal**: Smooth, accessible user experience

#### 4.1 Accessibility Enhancements

- Screen reader optimization
- Keyboard navigation
- Color contrast validation
- Focus management
- Alternative text for any icons

#### 4.2 Performance Optimization

- Lazy loading strategies
- Efficient DOM updates
- Minimize reflows/repaints
- JSON caching strategies

#### 4.3 Error Handling & Feedback

- Graceful JSON loading failures
- User-friendly error messages
- Loading states
- Empty state handling

## Technical Implementation Details

### JavaScript Modules

#### `storage.js` - Data Management

```javascript
// Responsibilities:
// - Load activities.json via fetch API
// - Handle loading errors with fallback data
// - Parse and validate JSON structure
// - Provide activities array to other modules
```

#### `filters.js` - Filtering Logic

```javascript
// Responsibilities:
// - Apply duration filters
// - Apply type filters
// - Combine multiple filter criteria
// - Return filtered activity arrays
```

#### `app.js` - Main Application Logic

```javascript
// Responsibilities:
// - Initialize application
// - Handle user interactions
// - Update DOM based on state changes
// - Coordinate between modules
```

### CSS Organization

#### Base Styles

- CSS Reset/Normalize
- Typography scale
- Color palette
- Spacing system

#### Component Styles

- Activity card styling
- Filter component styling
- Button and form element styling
- Layout containers

#### Responsive Design

- Mobile breakpoint: 768px
- Tablet breakpoint: 1024px
- Desktop optimization

### Error Handling Strategy

#### JSON Loading Errors

1. Network failure → Show offline message with fallback activities
2. Parse error → Log error, use fallback activities
3. Invalid structure → Validate and filter invalid entries

#### Runtime Errors

1. Filter failures → Reset to no filters
2. DOM manipulation errors → Graceful degradation
3. Unknown errors → Generic error message

## Testing Strategy

### Manual Testing Checklist

- [ ] Activities load correctly
- [ ] Filters work independently and combined
- [ ] Responsive design across devices
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Error states display properly
- [ ] Performance meets requirements

### Browser Compatibility Testing

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancement Roadmap

### Phase 5: User Customization (Future)

- Local storage for user preferences
- Custom activity creation
- Favorite activities
- Activity history

### Phase 6: Advanced Features (Future)

- Activity recommendations based on time of day
- Weather-based suggestions
- Difficulty progression tracking
- Social sharing capabilities

## Development Guidelines

### Code Standards

- ES6+ features with broad browser support
- Consistent naming conventions (camelCase)
- Comprehensive JSDoc comments
- Error handling for all async operations
- 80-character line limit for readability

### Accessibility Standards

- WCAG 2.1 AA compliance
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for all images
- Keyboard navigation support

### Performance Targets

- First Contentful Paint < 1.5s
- Time to Interactive < 2s
- Total bundle size < 100KB
- Accessibility score > 95

## Development Workflow

### Initial Setup

1. Create basic file structure
2. Set up HTML boilerplate
3. Create initial CSS framework
4. Implement basic JavaScript modules
5. Create sample activities.json

### Iterative Development

1. Implement one feature at a time
2. Test thoroughly before moving to next feature
3. Gather feedback at each milestone
4. Refactor and optimize as needed

### Documentation Updates

- Update README.md when features are added
- Maintain inline code documentation
- Keep this planning document current

## Success Metrics

### Technical Metrics

- Page load time < 2 seconds
- Zero accessibility violations
- 100% feature functionality across target browsers
- Clean, maintainable code structure

### User Experience Metrics

- Intuitive interface requiring no instructions
- Fast, responsive interactions
- Clear visual feedback for all actions
- Accessible to users with disabilities

This implementation plan provides a clear roadmap for building the ActivityAI application while maintaining focus on simplicity, accessibility, and future extensibility.
