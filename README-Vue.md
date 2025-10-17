# ActivitiesAI - Vue.js Implementation

This document contains Vue.js specific development information for the ActivitiesAI project. The main project documentation is in [README.md](./README.md).

## Vue.js Architecture Overview

This application showcases modern Vue 3 development patterns with the Composition API and TypeScript integration.

## Key Features Implemented

### Component Architecture

- **ActivityCard.vue**: Main activity display with responsive design and error handling
- **ActivityFilters.vue**: Collapsible filter interface with localStorage persistence
- **LoadingSpinner.vue**: Reusable loading component with multiple variants

### Composables (Vue 3 Composition API)

- **useActivities.ts**: Reactive activity data management with error handling
- **useFilters.ts**: Filter state management with automatic localStorage persistence

### Advanced Vue Features

- **Collapsible Components**: Smooth CSS transitions with height/opacity animations
- **Filter Persistence**: Automatic saving/loading of user preferences
- **Accessibility**: Full ARIA support with keyboard navigation
- **TypeScript Integration**: Complete type safety across all components

## Development Environment Setup

### Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

### Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Technical Implementation Details

### TypeScript Integration

- Full type support for `.vue` imports using `vue-tsc`
- Custom type definitions in `src/types/` for Activity and Filter interfaces
- Type-safe props and emits across all components

### State Management

- **Reactive Data**: Vue 3 `ref()` and `computed()` for local state
- **Persistence**: localStorage integration for filter preferences
- **Error Handling**: Comprehensive error states and user feedback

### CSS Architecture

- **Custom Properties**: CSS variables for consistent theming
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: Focus management and ARIA attributes
- **Animations**: Smooth transitions for collapsible components

### Testing Strategy

- **Unit Tests**: Vitest + Vue Test Utils for component testing
- **Coverage**: Comprehensive test coverage for components and composables
- **Accessibility Testing**: Focus management and ARIA attribute validation

## Configuration Files

- **vite.config.ts**: Vite build configuration with Vue plugin
- **vitest.config.ts**: Testing configuration with jsdom environment
- **tsconfig.json**: TypeScript configuration for Vue components
- **eslint.config.ts**: ESLint rules for Vue + TypeScript

## Project Setup & Commands

### Initial Setup

```sh
npm install
```

### Development Commands

```sh
# Start development server with hot-reload
npm run dev

# Build for production with type checking
npm run build

# Preview production build locally
npm run preview

# Run unit tests
npm run test:unit

# Run tests in watch mode during development
npm run test:unit:watch

# Lint code with ESLint
npm run lint
```

### Development Workflow

1. **Start Development**: `npm run dev` - Runs on `http://localhost:5173`
2. **Make Changes**: Hot reload automatically updates the browser
3. **Run Tests**: `npm run test:unit:watch` for continuous testing
4. **Type Check**: TypeScript errors are shown in real-time
5. **Build**: `npm run build` for production-ready files

## Component Development Patterns

### Example Component Structure

```vue
<template>
  <!-- Template with accessibility attributes -->
</template>

<script setup lang="ts">
// Imports
import { ref, computed } from 'vue'
import type { ComponentProps } from '../types/ComponentProps'

// Props & Emits with TypeScript
interface Props {
  // Define props
}
const props = defineProps<Props>()
const emit = defineEmits<{
  // Define emits
}>()

// Reactive state
const state = ref()
const computed = computed(() => {})

// Methods
const handleAction = () => {}
</script>

<style scoped>
/* Component-specific styles */
</style>
```

## Migration Notes

The original vanilla JavaScript version has been moved to `deprecated vanilla/` folder. Key improvements in the Vue version:

- **Better State Management**: Reactive data with automatic UI updates
- **Component Reusability**: Modular components with props/emits
- **Type Safety**: Full TypeScript integration
- **Testing**: Comprehensive unit test coverage
- **Performance**: Vite's optimized builds and tree-shaking
- **Developer Experience**: Hot reload, type checking, and better debugging
