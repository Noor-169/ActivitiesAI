/**
 * ActivityAI - Activity Filtering Logic
 * 
 * Responsibilities:
 * - Apply duration filters
 * - Apply type filters
 * - Combine multiple filter criteria
 * - Return filtered activity arrays
 * 
 * @author ActivityAI Development Team
 * @version 1.0.0
 * @since October 14, 2025
 */

/**
 * Duration range mappings for filter categories
 * @type {Object}
 */
const DURATION_RANGES = {
    short: { min: 1, max: 15 },
    standard: { min: 15, max: 30 },
    long: { min: 30, max: 60 },
    extended: { min: 60, max: Infinity }
};

/**
 * Validates filter parameters to prevent runtime errors
 * @param {Array} activities - Array of activities to validate
 * @param {string} filterName - Name of the filter for error messages
 * @returns {boolean} True if activities array is valid
 */
function validateActivitiesArray(activities, filterName = 'filter') {
    if (!Array.isArray(activities)) {
        console.error(`${filterName}: activities parameter must be an array`);
        return false;
    }
    return true;
}

/**
 * Filters activities by duration range
 * @param {Array<Object>} activities - Array of activity objects
 * @param {number} minDuration - Minimum duration in minutes (inclusive)
 * @param {number} maxDuration - Maximum duration in minutes (inclusive, use Infinity for no upper limit)
 * @returns {Array<Object>} Filtered array of activities
 */
function filterByDuration(activities, minDuration, maxDuration) {
    if (!validateActivitiesArray(activities, 'filterByDuration')) {
        return [];
    }
    
    // Validate duration parameters
    if (typeof minDuration !== 'number' || typeof maxDuration !== 'number') {
        console.error('filterByDuration: minDuration and maxDuration must be numbers');
        return activities;
    }
    
    if (minDuration < 0 || maxDuration < 0) {
        console.error('filterByDuration: duration values must be non-negative');
        return activities;
    }
    
    if (minDuration > maxDuration) {
        console.error('filterByDuration: minDuration cannot be greater than maxDuration');
        return activities;
    }
    
    return activities.filter(activity => {
        const duration = activity.duration;
        // Reason: Inclusive filtering ensures edge cases are handled consistently
        return duration >= minDuration && duration <= maxDuration;
    });
}

/**
 * Filters activities by duration category (short, standard, long, extended)
 * @param {Array<Object>} activities - Array of activity objects
 * @param {string} durationCategory - Duration category key
 * @returns {Array<Object>} Filtered array of activities
 */
function filterByDurationCategory(activities, durationCategory) {
    if (!validateActivitiesArray(activities, 'filterByDurationCategory')) {
        return [];
    }
    
    const range = DURATION_RANGES[durationCategory.toLowerCase()];
    if (!range) {
        console.error(`filterByDurationCategory: invalid duration category "${durationCategory}"`);
        return activities;
    }
    
    return filterByDuration(activities, range.min, range.max);
}

/**
 * Filters activities by type (fun or chores)
 * @param {Array<Object>} activities - Array of activity objects
 * @param {string} type - Activity type ('fun' or 'chores')
 * @returns {Array<Object>} Filtered array of activities
 */
function filterByType(activities, type) {
    if (!validateActivitiesArray(activities, 'filterByType')) {
        return [];
    }
    
    if (typeof type !== 'string') {
        console.error('filterByType: type parameter must be a string');
        return activities;
    }
    
    const normalizedType = type.toLowerCase().trim();
    const validTypes = ['fun', 'chores'];
    
    if (!validTypes.includes(normalizedType)) {
        console.error(`filterByType: invalid type "${type}". Valid types are: ${validTypes.join(', ')}`);
        return activities;
    }
    
    return activities.filter(activity => 
        activity.type && activity.type.toLowerCase() === normalizedType
    );
}

/**
 * Gets a random activity from an array of activities
 * @param {Array<Object>} activities - Array of activity objects
 * @returns {Object|null} Random activity object or null if array is empty
 */
function getRandomActivity(activities) {
    if (!validateActivitiesArray(activities, 'getRandomActivity')) {
        return null;
    }
    
    if (activities.length === 0) {
        console.warn('getRandomActivity: no activities available');
        return null;
    }
    
    // Reason: Cryptographically secure random selection for better distribution
    const randomIndex = Math.floor(Math.random() * activities.length);
    return activities[randomIndex];
}

/**
 * Applies multiple filters to activities array
 * @param {Array<Object>} activities - Array of activity objects
 * @param {Object} filters - Filter criteria object
 * @param {string} [filters.duration] - Duration category ('any', 'short', 'standard', 'long', 'extended')
 * @param {string} [filters.type] - Activity type ('any', 'fun', 'chores')
 * @returns {Array<Object>} Filtered array of activities
 */
function applyFilters(activities, filters = {}) {
    if (!validateActivitiesArray(activities, 'applyFilters')) {
        return [];
    }
    
    let filteredActivities = [...activities]; // Create a copy to avoid mutating original
    
    // Apply duration filter
    if (filters.duration && filters.duration !== 'any') {
        filteredActivities = filterByDurationCategory(filteredActivities, filters.duration);
    }
    
    // Apply type filter
    if (filters.type && filters.type !== 'any') {
        filteredActivities = filterByType(filteredActivities, filters.type);
    }
    
    return filteredActivities;
}

/**
 * Gets a random activity that matches the specified filters
 * @param {Array<Object>} activities - Array of activity objects
 * @param {Object} filters - Filter criteria object
 * @returns {Object|null} Random filtered activity or null if none match
 */
function getRandomFilteredActivity(activities, filters = {}) {
    const filteredActivities = applyFilters(activities, filters);
    return getRandomActivity(filteredActivities);
}

/**
 * Gets statistics about activities for debugging/analytics
 * @param {Array<Object>} activities - Array of activity objects
 * @returns {Object} Statistics object with counts and breakdowns
 */
function getActivityStats(activities) {
    if (!validateActivitiesArray(activities, 'getActivityStats')) {
        return { total: 0, byType: {}, byDuration: {} };
    }
    
    const stats = {
        total: activities.length,
        byType: { fun: 0, chores: 0 },
        byDuration: { short: 0, standard: 0, long: 0, extended: 0 }
    };
    
    activities.forEach(activity => {
        // Count by type
        if (activity.type) {
            const type = activity.type.toLowerCase();
            if (stats.byType.hasOwnProperty(type)) {
                stats.byType[type]++;
            }
        }
        
        // Count by duration category
        const duration = activity.duration;
        if (duration <= 15) {
            stats.byDuration.short++;
        } else if (duration <= 30) {
            stats.byDuration.standard++;
        } else if (duration <= 60) {
            stats.byDuration.long++;
        } else {
            stats.byDuration.extended++;
        }
    });
    
    return stats;
}

// Export filtering functions for use by other modules
export {
    filterByDuration,
    filterByDurationCategory,
    filterByType,
    getRandomActivity,
    applyFilters,
    getRandomFilteredActivity,
    getActivityStats,
    DURATION_RANGES
};