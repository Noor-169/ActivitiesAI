# ActivitiesAI

A modern Vue.js activity suggestion app that helps you discover fun activities and productive tasks based on your available time and preferences.

## Features

- **Smart Suggestions**: Get personalized activity recommendations
- **Flexible Filtering**: Filter by duration (1-15 min, 15-30 min, 30-60 min, 60+ min) and type (fun vs chores)
- **Collapsible Interface**: Space-efficient collapsible filters with visual indicators
- **Filter Persistence**: Your filter preferences are saved automatically using localStorage
- **Accessible Design**: Built with accessibility in mind for all users (WCAG 2.1 AA compliance)
- **Modern Stack**: Vue 3 + TypeScript + Vite for optimal performance and developer experience
- **Comprehensive Testing**: Full test suite with Vitest and Vue Test Utils

## Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/Noor-169/ActivitiesAI.git
   cd ActivitiesAI
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

5. **Start discovering activities!**

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run unit tests
npm run test:unit

# Run tests in watch mode
npm run test:unit:watch
```

## Technology Stack

- **Frontend**: Vue 3 with Composition API, TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Testing**: Vitest + Vue Test Utils for comprehensive unit testing
- **Styling**: CSS with custom properties and responsive design
- **Data Storage**: Static JSON file with localStorage for filter persistence
- **Code Quality**: ESLint + Prettier for consistent code formatting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Project Structure

```
ActivitiesAI/
├── index.html              # Main application entry point
├── package.json            # Project dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── vitest.config.ts        # Vitest testing configuration
├── eslint.config.ts        # ESLint configuration
├── README.md               # Project documentation
├── deprecated vanilla/     # Original vanilla JS version (archived)
├── public/
│   ├── favicon.ico         # App favicon
│   └── data/
│       └── activities.json # Activity database
└── src/
    ├── main.ts             # Application entry point
    ├── App.vue             # Root Vue component
    ├── components/         # Vue components
    │   ├── ActivityCard.vue
    │   ├── ActivityFilters.vue
    │   ├── LoadingSpinner.vue
    │   └── __tests__/      # Component unit tests
    ├── composables/        # Vue composables
    │   ├── useActivities.ts
    │   └── useFilters.ts
    ├── types/              # TypeScript type definitions
    │   ├── Activity.ts
    │   └── Filters.ts
    └── utils/              # Utility functions
        ├── formatters.ts
        └── validators.ts
```

## Development

This project follows modern Vue.js best practices with:

- **Component Architecture**: Modular, reusable Vue components with TypeScript
- **Composables**: Reactive data management with Vue's Composition API
- **Comprehensive Testing**: Unit tests for all components and composables
- **Accessibility**: WCAG 2.1 AA compliance with ARIA attributes and keyboard navigation
- **Responsive Design**: Mobile-first approach with CSS custom properties
- **Performance**: Optimized with Vite's fast builds and tree-shaking
- **Type Safety**: Full TypeScript integration for better developer experience

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test:unit    # Run unit tests
npm run lint         # Run ESLint
```

### Component Overview

- **ActivityCard**: Displays individual activity suggestions with loading states
- **ActivityFilters**: Collapsible filter interface with persistence
- **LoadingSpinner**: Reusable loading component with variants
- **useActivities**: Composable for activity data management
- **useFilters**: Composable for filter state and localStorage persistence

## Contributing

This is currently a personal project. Feel free to fork and adapt for your own use!

## License

Open source - use freely for personal or educational purposes.

---

**Started**: October 14, 2025  
**Vue Migration**: October 2025  
**Status**: Production Ready (Phase 2 - Vue.js Implementation Complete)
