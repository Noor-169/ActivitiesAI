# "Iets te Doen" - Development Plan

## Project Overview

Dutch activity suggestion app built with Vue 3 + TypeScript. Users get random activity suggestions with filtering by duration and type (fun/chores).

## Current Status ✅ COMPLETED

- **Vue 3 + TypeScript migration** - App successfully converted from vanilla JS
- **Static JSON data** - 62 activities translated to Dutch
- **GitHub Pages deployment** - Working at https://noor-169.github.io/iets_te_doen/
- **Basic filtering** - Duration and type filters implemented
- **Responsive design** - Mobile-first approach

## Current Architecture

```
src/
├── components/           # Vue components
├── composables/         # Business logic (useActivities, useFilters)
├── types/              # TypeScript definitions
├── utils/              # Helper functions
└── public/data/        # JSON activity data
```

## Activity Data Structure

```typescript
interface Activity {
  id: number
  title: string // Dutch titles
  duration: number // minutes
  type: 'fun' | 'chores'
  description?: string // Dutch descriptions
  difficulty?: 'easy' | 'medium' | 'hard'
  materials?: string[] // Dutch materials list
}
```

## Development History

### ✅ Phase 1: Foundation (COMPLETED)

- **Vanilla JS → Vue 3 + TypeScript migration**
- **Component architecture** - ActivityCard, ActivityFilters, LoadingSpinner
- **Type-safe composables** - useActivities, useFilters
- **GitHub Pages deployment** - Fixed BASE_URL issues
- **Dutch translation** - All 62 activities translated

### 🔄 Current Architecture

- **Tech Stack**: Vue 3, TypeScript, Vite
- **State Management**: Composables with reactive refs
- **Data Source**: Static JSON (62 Dutch activities)
- **Deployment**: GitHub Actions → GitHub Pages
- **Features**: Random selection, duration/type filtering

## Next Steps Roadmap

### 🔄 Phase 2: Backend + User System

1. **Laravel API Setup**
   - MySQL database + user authentication
   - Migrate JSON activities to database
   - Personal activity lists per user

2. **Frontend Integration**
   - Login/register components
   - API integration replacing static JSON
   - User-specific activity management

### 📋 Phase 3: Enhanced Features

1. **Timer Component**
   - Optional activity timer (start/pause/stop)
   - Local storage for timer state

2. **Theme System**
   - Multiple color schemes
   - CSS custom properties + theme selector
   - User preference storage

### 🎯 Phase 4: Smart Features

1. **Daily Check-in**
   - Modal asking about user's day type
   - Contextual activity suggestions
   - Pattern recognition for recommendations

### 🤖 Phase 5: AI Integration (Future)

1. **Activity Generator**
   - AI-powered activity suggestions
   - Based on user's existing activities
   - Personalized recommendations

### Dependencies

- Backend → Authentication → Personal Activities
- Timer + Themes can be parallel
- Check-in needs user system
- AI needs established user data
