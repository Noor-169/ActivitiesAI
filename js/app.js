/**
 * ActivityAI - Main Application Logic
 * 
 * Responsibilities:
 * - Initialize application
 * - Handle user interactions
 * - Update DOM based on state changes
 * - Coordinate between modules
 * 
 * @author ActivityAI Development Team
 * @version 1.0.0
 * @since October 14, 2025
 */

import { getActivities } from './storage.js';
import { getRandomFilteredActivity, getActivityStats } from './filters.js';

/**
 * Application state management
 * @type {Object}
 */
const appState = {
    activities: [],
    currentActivity: null,
    filters: {
        duration: 'any',
        type: 'any'
    },
    isLoading: false
};

/**
 * Cached DOM elements for performance
 * @type {Object}
 */
const elements = {};

/**
 * Caches DOM element references for efficient access
 * Reason: Caching DOM queries improves performance and reduces repeated DOM traversal
 */
function cacheElements() {
    elements.activityDisplay = document.getElementById('activity-display');
    elements.activityContent = document.getElementById('activity-content');
    elements.welcomeMessage = document.getElementById('welcome-message');
    elements.loadingMessage = document.getElementById('loading-message');
    elements.errorMessage = document.getElementById('error-message');
    elements.getActivityButton = document.getElementById('get-activity');
    elements.resetFiltersButton = document.getElementById('reset-filters');
    elements.activityFilters = document.getElementById('activity-filters');
    
    // Cache filter input elements
    elements.durationInputs = document.querySelectorAll('input[name="duration"]');
    elements.typeInputs = document.querySelectorAll('input[name="type"]');
}

/**
 * Shows loading state in the UI
 */
function showLoading() {
    appState.isLoading = true;
    elements.welcomeMessage.hidden = true;
    elements.errorMessage.hidden = true;
    elements.loadingMessage.hidden = false;
    elements.getActivityButton.disabled = true;
    elements.getActivityButton.textContent = 'Loading...';
}

/**
 * Hides loading state in the UI
 */
function hideLoading() {
    appState.isLoading = false;
    elements.loadingMessage.hidden = true;
    elements.getActivityButton.disabled = false;
    elements.getActivityButton.textContent = 'Get Activity';
}

/**
 * Displays an error message to the user
 * @param {string} message - Error message to display
 */
function showError(message) {
    hideLoading();
    elements.welcomeMessage.hidden = true;
    elements.errorMessage.hidden = false;
    
    const errorText = elements.errorMessage.querySelector('p');
    if (errorText) {
        errorText.textContent = message || 'Sorry, something went wrong. Please try again.';
    }
}

/**
 * Formats duration for display
 * @param {number} duration - Duration in minutes
 * @returns {string} Formatted duration string
 */
function formatDuration(duration) {
    if (duration < 60) {
        return `${duration} min`;
    } else {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        if (minutes === 0) {
            return `${hours} hour${hours > 1 ? 's' : ''}`;
        } else {
            return `${hours}h ${minutes}m`;
        }
    }
}

/**
 * Formats activity type for display
 * @param {string} type - Activity type ('fun' or 'chores')
 * @returns {string} Formatted type string
 */
function formatActivityType(type) {
    return type === 'chores' ? 'Productive Task' : 'Fun Activity';
}

/**
 * Creates DOM elements programmatically (alternative approach)
 * @param {Object} activity - Activity object to display
 * @returns {DocumentFragment} DOM fragment with activity elements
 */
function createActivityElementsProgrammatically(activity) {
    const fragment = document.createDocumentFragment();
    
    // Create title element
    const titleElement = document.createElement('div');
    titleElement.className = 'activity-title';
    titleElement.textContent = activity.title;
    fragment.appendChild(titleElement);
    
    // Create details container
    const detailsElement = document.createElement('div');
    detailsElement.className = 'activity-details';
    
    // Create duration badge
    const durationBadge = document.createElement('span');
    durationBadge.className = 'activity-badge activity-badge--duration';
    durationBadge.textContent = formatDuration(activity.duration);
    detailsElement.appendChild(durationBadge);
    
    // Create type badge
    const typeBadge = document.createElement('span');
    typeBadge.className = 'activity-badge activity-badge--type';
    typeBadge.textContent = formatActivityType(activity.type);
    detailsElement.appendChild(typeBadge);
    
    fragment.appendChild(detailsElement);
    
    // Add description if available
    if (activity.description) {
        const descriptionElement = document.createElement('p');
        descriptionElement.className = 'activity-description';
        descriptionElement.textContent = activity.description;
        fragment.appendChild(descriptionElement);
    }
    
    return fragment;
}

/**
 * Creates activity elements using HTML template cloning (preferred approach)
 * @param {Object} activity - Activity object to display
 * @returns {DocumentFragment} Cloned and populated template
 */
function createActivityElementsFromTemplate(activity) {
    const template = document.getElementById('activity-template');
    if (!template) {
        console.warn('Activity template not found, falling back to programmatic creation');
        return createActivityElementsProgrammatically(activity);
    }
    
    // Clone the template content
    const clone = template.content.cloneNode(true);
    
    // Populate the cloned elements
    const titleElement = clone.querySelector('.activity-title');
    const durationBadge = clone.querySelector('.activity-badge--duration');
    const typeBadge = clone.querySelector('.activity-badge--type');
    const descriptionElement = clone.querySelector('.activity-description');
    
    // Set content using textContent for security
    titleElement.textContent = activity.title;
    durationBadge.textContent = formatDuration(activity.duration);
    typeBadge.textContent = formatActivityType(activity.type);
    
    // Handle optional description
    if (activity.description) {
        descriptionElement.textContent = activity.description;
    } else {
        descriptionElement.remove();
    }
    
    return clone;
}

/**
 * Displays an activity in the UI using DOM manipulation
 * @param {Object} activity - Activity object to display
 */
function displayActivity(activity) {
    if (!activity) {
        showError('No activities match your current filters. Try adjusting your criteria.');
        return;
    }
    
    // Hide messages and show activity
    elements.welcomeMessage.hidden = true;
    elements.errorMessage.hidden = true;
    elements.loadingMessage.hidden = true;
    
    // Clear existing content
    elements.activityContent.replaceChildren();
    
    // Create and append new activity elements using template approach
    const activityElements = createActivityElementsFromTemplate(activity);
    elements.activityContent.appendChild(activityElements);
    
    // Update app state
    appState.currentActivity = activity;
    
    // Announce to screen readers
    elements.activityDisplay.setAttribute('aria-label', 
        `Current activity: ${activity.title}, ${formatDuration(activity.duration)}, ${formatActivityType(activity.type)}`
    );
}

/**
 * Gets current filter values from form inputs
 * @returns {Object} Current filter state
 */
function getCurrentFilters() {
    const durationFilter = document.querySelector('input[name="duration"]:checked')?.value || 'any';
    const typeFilter = document.querySelector('input[name="type"]:checked')?.value || 'any';
    
    return {
        duration: durationFilter,
        type: typeFilter
    };
}

/**
 * Updates the application state with current filter values
 */
function updateFiltersFromForm() {
    appState.filters = getCurrentFilters();
    console.log('Filters updated:', appState.filters);
}

/**
 * Handles getting a new activity based on current filters
 */
async function handleGetActivity() {
    try {
        const startTime = Date.now();
        let showLoadingTimeout;
        
        // Only show loading if operation takes longer than 1 second
        showLoadingTimeout = setTimeout(() => {
            showLoading();
        }, 1000);
        
        // Disable button immediately for feedback
        elements.getActivityButton.disabled = true;
        
        // Ensure activities are loaded
        if (appState.activities.length === 0) {
            appState.activities = await getActivities();
        }
        
        // Update filters from form
        updateFiltersFromForm();
        
        // Get random activity matching filters
        const activity = getRandomFilteredActivity(appState.activities, appState.filters);
        
        // Clear the loading timeout since we're done
        clearTimeout(showLoadingTimeout);
        
        // If loading was shown, hide it; otherwise just re-enable button
        if (appState.isLoading) {
            hideLoading();
        } else {
            elements.getActivityButton.disabled = false;
        }
        
        displayActivity(activity);
        
    } catch (error) {
        console.error('Error getting activity:', error);
        showError('Failed to get activity. Please try again.');
    }
}

/**
 * Resets all filters to their default state
 */
function handleResetFilters() {
    // Reset radio buttons to 'any' options
    const durationAny = document.getElementById('duration-any');
    const typeAny = document.getElementById('type-any');
    
    if (durationAny) durationAny.checked = true;
    if (typeAny) typeAny.checked = true;
    
    // Update app state
    appState.filters = { duration: 'any', type: 'any' };
    
    console.log('Filters reset to default');
    
    // Provide user feedback
    const resetButton = elements.resetFiltersButton;
    const originalText = resetButton.textContent;
    resetButton.textContent = 'Reset ✓';
    setTimeout(() => {
        resetButton.textContent = originalText;
    }, 1000);
}

/**
 * Handles filter change events
 * @param {Event} event - Change event from filter input
 */
function handleFilterChange(event) {
    updateFiltersFromForm();
    
    // Reason: Real-time filter feedback helps users understand the impact of their choices
    const stats = getActivityStats(appState.activities);
    console.log('Available activities:', stats);
}

/**
 * Sets up event listeners for user interactions
 */
function setupEventListeners() {
    // Get Activity button
    elements.getActivityButton.addEventListener('click', handleGetActivity);
    
    // Reset Filters button
    elements.resetFiltersButton.addEventListener('click', handleResetFilters);
    
    // Filter change listeners
    elements.durationInputs.forEach(input => {
        input.addEventListener('change', handleFilterChange);
    });
    
    elements.typeInputs.forEach(input => {
        input.addEventListener('change', handleFilterChange);
    });
    
    // Keyboard accessibility for form submission
    elements.activityFilters.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.target.tagName !== 'BUTTON') {
            event.preventDefault();
            handleGetActivity();
        }
    });
    
    console.log('Event listeners initialized');
}

/**
 * Initializes the application
 * Reason: Centralized initialization ensures proper setup order and error handling
 */
async function initializeApp() {
    try {
        console.log('Initializing ActivityAI...');
        
        // Cache DOM elements
        cacheElements();
        
        // Verify required elements exist
        const requiredElements = ['activityDisplay', 'getActivityButton', 'activityFilters'];
        const missingElements = requiredElements.filter(key => !elements[key]);
        
        if (missingElements.length > 0) {
            throw new Error(`Missing required DOM elements: ${missingElements.join(', ')}`);
        }
        
        // Set up event listeners
        setupEventListeners();
        
        // Pre-load activities for better UX
        showLoading();
        appState.activities = await getActivities();
        hideLoading();
        
        // Log success and stats
        const stats = getActivityStats(appState.activities);
        console.log('ActivityAI initialized successfully!');
        console.log('Activity statistics:', stats);
        
        // Set initial welcome state
        elements.welcomeMessage.hidden = false;
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showError('Failed to initialize the application. Please refresh the page.');
    }
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already ready
    initializeApp();
}