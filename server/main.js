import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/api/TasksCollection';

const SEED_TASKS = [
  'First Task',
  'Second Task',
  'Third Task',
  'Fourth Task',
  'Fifth Task',
  'Sixth Task',
  'Seventh Task',
];

Meteor.startup(async () => {
  const cursor = TasksCollection.find();
  const existingCount = await cursor.countAsync();

  if (existingCount === 0) {
    const insertTask = (taskText) => TasksCollection.insertAsync({ text: taskText });

    await Promise.all(SEED_TASKS.map(insertTask));
  }
});