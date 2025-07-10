// Guest user utilities
export const createGuestUser = () => {
    const guestId = 'guest_' + Date.now();
    return {
        userId: guestId,
        username: 'Guest User',
        email: 'guest@example.com',
        isGuest: true,
        displayName: 'Guest User'
    };
};

// Guest data storage keys
export const GUEST_KEYS = {
    POSTS: 'guestPosts',
    LIKES: 'guestLikes', 
    SAVES: 'guestSaves',
    IS_GUEST: 'isGuest'
};

// Store guest data in sessionStorage
export const storeGuestData = (key, data) => {
    if (typeof data === 'object') {
        sessionStorage.setItem(key, JSON.stringify(data));
    } else {
        sessionStorage.setItem(key, data);
    }
};

// Retrieve guest data from sessionStorage
export const getGuestData = (key, defaultValue = []) => {
    const data = sessionStorage.getItem(key);
    if (data) {
        try {
            return JSON.parse(data);
        } catch {
            return defaultValue;
        }
    }
    return defaultValue;
};

// Clean up all guest data
export const cleanupGuestData = () => {
    Object.values(GUEST_KEYS).forEach(key => {
        sessionStorage.removeItem(key);
    });
};

// Check if current user is a guest
export const isGuestUser = (user) => {
    return user && user.isGuest === true;
};

// Generate unique guest ID
export const generateGuestId = () => {
    return 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}; 