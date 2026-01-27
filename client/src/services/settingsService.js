import { supabase } from './supabaseClient';

const API_BASE_URL = 'http://localhost:3001';

/**
 * Save or update user's Google Sheets settings
 */
export async function saveUserSettings(userId, { googleSheetId, googleServiceEmail, googlePrivateKey }) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/user/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                googleSheetId,
                googleServiceEmail,
                googlePrivateKey
            })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error saving user settings:', error);
        throw error;
    }
}

/**
 * Get user's Google Sheets settings
 */
export async function getUserSettings(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/user/settings/${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user settings:', error);
        throw error;
    }
}

/**
 * Delete user's Google Sheets settings
 */
export async function deleteUserSettings(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/user/settings/${userId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting user settings:', error);
        throw error;
    }
}

export default {
    saveUserSettings,
    getUserSettings,
    deleteUserSettings
};
