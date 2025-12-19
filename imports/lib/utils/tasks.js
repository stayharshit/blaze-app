import { TasksCollection } from '../../db/collections/TasksCollection';

/**
 * Build a MongoDB selector for tasks based on filters
 * @param {Object} params - Filter parameters
 * @param {string|null} params.userId - User ID
 * @param {boolean} params.hideCompleted - Whether to hide completed tasks
 * @param {string} params.searchTerm - Search term for task text
 * @param {string} params.priorityFilter - Priority filter value
 * @returns {Object|null} MongoDB selector or null if no userId
 */
export const buildTasksSelector = ({ userId, hideCompleted, searchTerm, priorityFilter }) => {
  if (!userId) {
    return null;
  }

  const selector = { userId };

  if (hideCompleted) {
    selector.isChecked = { $ne: true };
  }

  if (searchTerm && searchTerm.trim()) {
    selector.text = { $regex: searchTerm.trim(), $options: 'i' };
  }

  if (priorityFilter) {
    selector.priority = priorityFilter;
  }

  return selector;
};

/**
 * Build a selector for incomplete tasks
 * @param {Object} params - Filter parameters
 * @param {string|null} params.userId - User ID
 * @returns {Object|null} MongoDB selector or null
 */
export const buildIncompleteSelector = ({ userId }) =>
  buildTasksSelector({ userId, hideCompleted: true, searchTerm: '', priorityFilter: '' });

/**
 * Check if a task is overdue
 * @param {Object} task - Task object
 * @returns {boolean} True if task is overdue
 */
export const isTaskOverdue = (task) => {
  if (!task.dueDate || task.isChecked) return false;
  return new Date(task.dueDate) < new Date();
};

/**
 * Format a date for display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (d.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (d.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
