import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '../db/TasksCollection';

Meteor.publish('tasks', function publishTasks() {
    if (!this.userId) {
        return this.ready();
    }

    return TasksCollection.find(
        { userId: this.userId },
        { sort: { createdAt: -1 } },
    );
});