import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { TasksCollection } from '../db/TasksCollection';

const requireUserId = (userId) => {
    if (!userId) {
        throw new Meteor.Error('not-authorized', 'Not authorized.');
    }
    return userId;
};

const createTaskDoc = ({ text, userId, priority, dueDate, category }) => ({
    text,
    userId,
    priority: priority || 'medium',
    dueDate: dueDate ? new Date(dueDate) : null,
    category: category || null,
    createdAt: new Date(),
});

Meteor.methods({
    'tasks.insert': async function tasksInsert(text, priority, dueDate, category) {
        check(text, String);
        check(priority, Match.Optional(String));
        check(dueDate, Match.Optional(String));
        check(category, Match.Optional(String));

        const userId = requireUserId(this.userId);
        return TasksCollection.insertAsync(createTaskDoc({ text, userId, priority, dueDate, category }));
    },

    'tasks.update': async function tasksUpdate(taskId, updates) {
        check(taskId, String);
        check(updates, Object);

        const userId = requireUserId(this.userId);
        const allowedFields = ['text', 'priority', 'dueDate', 'category'];
        const sanitizedUpdates = {};

        Object.keys(updates).forEach((key) => {
            if (allowedFields.includes(key)) {
                sanitizedUpdates[key] = updates[key];
            }
        });

        if (sanitizedUpdates.dueDate) {
            sanitizedUpdates.dueDate = new Date(sanitizedUpdates.dueDate);
        }

        if (sanitizedUpdates.text) {
            check(sanitizedUpdates.text, String);
        }
        if (sanitizedUpdates.priority) {
            check(sanitizedUpdates.priority, String);
        }
        if (sanitizedUpdates.category) {
            check(sanitizedUpdates.category, String);
        }

        const updatedCount = await TasksCollection.updateAsync(
            { _id: taskId, userId },
            { $set: sanitizedUpdates },
        );

        if (!updatedCount) {
            throw new Meteor.Error('access-denied', 'Access denied.');
        }

        return updatedCount;
    },

    'tasks.remove': async function tasksRemove(taskId) {
        check(taskId, String);

        const userId = requireUserId(this.userId);
        const removedCount = await TasksCollection.removeAsync({ _id: taskId, userId });

        if (!removedCount) {
            throw new Meteor.Error('access-denied', 'Access denied.');
        }

        return removedCount;
    },

    'tasks.setIsChecked': async function tasksSetIsChecked(taskId, isChecked) {
        check(taskId, String);
        check(isChecked, Boolean);

        const userId = requireUserId(this.userId);
        const updatedCount = await TasksCollection.updateAsync(
            { _id: taskId, userId },
            { $set: { isChecked } },
        );

        if (!updatedCount) {
            throw new Meteor.Error('access-denied', 'Access denied.');
        }

        return updatedCount;
    },

    'tasks.getStats': async function tasksGetStats() {
        const userId = requireUserId(this.userId);
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate() + 1);

        const total = await TasksCollection.find({ userId }).countAsync();
        const completed = await TasksCollection.find({ userId, isChecked: true }).countAsync();
        const incomplete = await TasksCollection.find({ userId, isChecked: { $ne: true } }).countAsync();
        const highPriority = await TasksCollection.find({ userId, priority: 'high', isChecked: { $ne: true } }).countAsync();
        const dueToday = await TasksCollection.find({
            userId,
            dueDate: { $gte: todayStart, $lt: todayEnd },
            isChecked: { $ne: true },
        }).countAsync();

        return { total, completed, incomplete, highPriority, dueToday };
    },
});