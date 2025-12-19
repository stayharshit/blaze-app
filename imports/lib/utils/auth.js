import { Meteor } from 'meteor/meteor';

/**
 * Get the current logged-in user
 * @returns {Object|null} The current user object or null
 */
export const getUser = () => Meteor.user();

/**
 * Get the current logged-in user ID
 * @returns {string|null} The current user ID or null
 */
export const getUserId = () => Meteor.userId();

/**
 * Check if a user is currently logged in
 * @returns {boolean} True if user is logged in, false otherwise
 */
export const isUserLogged = () => Boolean(getUserId());

/**
 * Require a user to be logged in, throw error if not
 * @param {string|null} userId - The user ID to check
 * @returns {string} The user ID
 * @throws {Meteor.Error} If user is not authorized
 */
export const requireUserId = (userId) => {
    if (!userId) {
        throw new Meteor.Error('not-authorized', 'Not authorized.');
    }
    return userId;
};
