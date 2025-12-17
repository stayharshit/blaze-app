import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TasksCollection } from '../db/TasksCollection';

Meteor.methods({
    async 'tasks.insert'(text) {
        check(text, String);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        return await TasksCollection.insertAsync({
            text,
            createdAt: new Date(),
            userId: this.userId,
        });
    },

    async 'tasks.remove'(taskId) {
        check(taskId, String);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        const removedCount = await TasksCollection.removeAsync({ _id: taskId, userId: this.userId });

        if (!removedCount) {
            throw new Meteor.Error('Access denied.');
        }

        return removedCount;
    },

    async 'tasks.setIsChecked'(taskId, isChecked) {
        check(taskId, String);
        check(isChecked, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        const updatedCount = await TasksCollection.updateAsync({ _id: taskId, userId: this.userId }, {
            $set: {
                isChecked,
            },
        });

        if (!updatedCount) {
            throw new Meteor.Error('Access denied.');
        }

        return updatedCount;
    }
});