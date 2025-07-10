// Guest mode comment: Guest user utilities for managing temporary guest accounts
import { useState, useEffect } from 'react';

// Guest mode comment: Create a new guest user object with unique ID
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

// Guest mode comment: Storage keys for guest data in sessionStorage
export const GUEST_KEYS = {
    POSTS: 'guestPosts',
    LIKES: 'guestLikes', 
    SAVES: 'guestSaves',
    IS_GUEST: 'isGuest'
};

// Guest mode comment: Store guest data in sessionStorage (temporary storage)
export const storeGuestData = (key, data) => {
    if (typeof data === 'object') {
        sessionStorage.setItem(key, JSON.stringify(data));
    } else {
        sessionStorage.setItem(key, data);
    }
};

// Guest mode comment: Retrieve guest data from sessionStorage
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

// Guest mode comment: Clean up all guest data when guest leaves
export const cleanupGuestData = () => {
    Object.values(GUEST_KEYS).forEach(key => {
        sessionStorage.removeItem(key);
    });
};

// Guest mode comment: Check if current user is a guest user
export const isGuestUser = (user) => {
    return user && user.isGuest === true;
};

// Guest mode comment: Generate unique guest ID for temporary data
export const generateGuestId = () => {
    return 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}; 