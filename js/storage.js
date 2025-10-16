/**
 * ActivityAI - Data Storage Management
 * 
 * Responsibilities:
 * - Load activities.json via fetch API
 * - Handle loading errors with fallback data
 * - Parse and validate JSON structure
 * - Provide activities array to other modules
 * 
 * @author ActivityAI Development Team
 * @version 1.0.0
 * @since October 14, 2025
 */

/**
 * Fallback activity data used when JSON loading fails
 * @type {Array<Object>}
 */
const FALLBACK_ACTIVITIES = [
    {
        id: 1,
        title: "Organize your desk",
        duration: 10,
        type: "chores",
        description: "Clear clutter and organize your workspace for better productivity"
    },
    {
        id: 2,
        title: "Take a mindful walk",
        duration: 15,
        type: "fun",
        description: "Step outside and enjoy a peaceful walk while being present"
    },
    {
        id: 3,
        title: "Read a book chapter",
        duration: 25,
        type: "fun",
        description: "Dive into your current book and read at least one chapter"
    },
    {
        id: 4,
        title: "Do 10 minutes of stretching",
        duration: 10,
        type: "fun",
        description: "Gentle stretches to release tension and improve flexibility"
    },
    {
        id: 5,
        title: "Clean out your email inbox",
        duration: 20,
        type: "chores",
        description: "Delete unnecessary emails and organize important ones"
    },
    {
        id: 6,
        title: "Practice deep breathing",
        duration: 5,
        type: "fun",
        description: "Take 5 minutes to focus on your breath and center yourself"
    },
    {
        id: 7,
        title: "Water your plants",
        duration: 8,
        type: "chores",
        description: "Check and water your indoor or outdoor plants"
    },
    {
        id: 8,
        title: "Write in a journal",
        duration: 15,
        type: "fun",
        description: "Reflect on your day or express your thoughts in writing"
    },
    {
        id: 9,
        title: "Tidy up one room",
        duration: 30,
        type: "chores",
        description: "Pick one room and spend 30 minutes making it neat and organized"
    },
    {
        id: 10,
        title: "Learn something new online",
        duration: 45,
        type: "fun",
        description: "Watch a tutorial or educational video on a topic that interests you"
    },
    {
        id: 11,
        title: "Meal prep for tomorrow",
        duration: 40,
        type: "chores",
        description: "Prepare ingredients or meals for the next day"
    },
    {
        id: 12,
        title: "Call a friend or family member",
        duration: 20,
        type: "fun",
        description: "Reconnect with someone you care about"
    }
];

/**
 * Validates an individual activity object
 * @param {Object} activity - The activity object to validate
 * @returns {boolean} True if the activity is valid, false otherwise
 */
function validateActivity(activity) {
    // Reason: Comprehensive validation ensures data integrity and prevents runtime errors
    if (!activity || typeof activity !== 'object') {
        return false;
    }
    
    const requiredFields = ['id', 'title', 'duration', 'type'];
    const hasRequiredFields = requiredFields.every(field => 
        activity.hasOwnProperty(field) && activity[field] !== null && activity[field] !== undefined
    );
    
    if (!hasRequiredFields) {
        return false;
    }
    
    // Validate field types and values
    return (
        typeof activity.id === 'number' &&
        typeof activity.title === 'string' && activity.title.trim().length > 0 &&
        typeof activity.duration === 'number' && activity.duration > 0 &&
        typeof activity.type === 'string' && ['fun', 'chores'].includes(activity.type.toLowerCase())
    );
}

/**
 * Validates an array of activities
 * @param {Array} activities - Array of activity objects to validate
 * @returns {Array} Array of valid activities (invalid ones are filtered out)
 */
function validateActivities(activities) {
    if (!Array.isArray(activities)) {
        console.warn('Activities data is not an array, using fallback data');
        return FALLBACK_ACTIVITIES;
    }
    
    const validActivities = activities.filter(activity => {
        const isValid = validateActivity(activity);
        if (!isValid) {
            console.warn('Invalid activity found and removed:', activity);
        }
        return isValid;
    });
    
    // Reason: Ensure we always have activities to show, even if some are invalid
    if (validActivities.length === 0) {
        console.warn('No valid activities found, using fallback data');
        return FALLBACK_ACTIVITIES;
    }
    
    return validActivities;
}

/**
 * Loads activities from the JSON file with comprehensive error handling
 * @returns {Promise<Array>} Promise that resolves to an array of validated activities
 */
async function loadActivities() {
    try {
        console.log('Loading activities from data/activities.json...');
        
        // Fetch the JSON file
        const response = await fetch('./data/activities.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse JSON with error handling
        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            throw new Error(`JSON parsing failed: ${parseError.message}`);
        }
        
        // Extract activities array from JSON structure
        const activities = data.activities || data;
        
        // Validate and return activities
        const validatedActivities = validateActivities(activities);
        console.log(`Successfully loaded ${validatedActivities.length} activities`);
        
        return validatedActivities;
        
    } catch (error) {
        // Reason: Comprehensive error logging helps with debugging while graceful fallback ensures app functionality
        console.error('Failed to load activities:', error.message);
        console.log('Using fallback activity data');
        
        return FALLBACK_ACTIVITIES;
    }
}

/**
 * Gets activities with caching to avoid repeated network requests
 * @returns {Promise<Array>} Promise that resolves to cached or freshly loaded activities
 */
let activitiesCache = null;
async function getActivities() {
    // Reason: Caching prevents unnecessary network requests and improves performance
    if (activitiesCache === null) {
        activitiesCache = await loadActivities();
    }
    return activitiesCache;
}

/**
 * Clears the activities cache (useful for testing or if data needs to be reloaded)
 */
function clearActivitiesCache() {
    activitiesCache = null;
    console.log('Activities cache cleared');
}

// Export functions for use by other modules
export {
    loadActivities,
    getActivities,
    validateActivity,
    validateActivities,
    clearActivitiesCache,
    FALLBACK_ACTIVITIES
};