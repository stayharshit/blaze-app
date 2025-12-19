import { check, Match } from 'meteor/check';
import { TASK_UPDATE_ALLOWED_FIELDS } from '../constants/tasks';

/**
 * Validate task text input
 * @param {string} text - Task text to validate
 * @throws {Error} If validation fails
 */
export const validateTaskText = (text) => {
  check(text, String);
  if (!text || !text.trim()) {
    throw new Error('Task text is required');
  }
};

/**
 * Validate task priority
 * @param {string} priority - Priority value to validate
 * @throws {Error} If validation fails
 */
export const validateTaskPriority = (priority) => {
  check(priority, Match.Optional(String));
  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    throw new Error('Invalid priority value');
  }
};

/**
 * Sanitize task updates to only include allowed fields
 * @param {Object} updates - Raw update object
 * @returns {Object} Sanitized update object
 */
export const sanitizeTaskUpdates = (updates) => {
  check(updates, Object);
  const sanitized = {};

  Object.keys(updates).forEach((key) => {
    if (TASK_UPDATE_ALLOWED_FIELDS.includes(key)) {
      sanitized[key] = updates[key];
    }
  });

  // Convert dueDate string to Date if present
  if (sanitized.dueDate) {
    sanitized.dueDate = new Date(sanitized.dueDate);
  }

  // Validate fields if present
  if (sanitized.text) {
    check(sanitized.text, String);
  }
  if (sanitized.priority) {
    validateTaskPriority(sanitized.priority);
  }
  if (sanitized.category) {
    check(sanitized.category, String);
  }

  return sanitized;
};
