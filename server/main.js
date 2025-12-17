import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
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

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';
const insertTask = (taskText, user) => TasksCollection.insertAsync({ text: taskText, userId: user._id, createdAt: new Date() });

Meteor.startup(async () => {
  let user = await Accounts.findUserByUsername(SEED_USERNAME);

  if (!user) {
    const userId = await Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });

    user = await Accounts.findUserByUsername(SEED_USERNAME) ?? await Meteor.users.findOneAsync(userId);
  }

  // Ensure the seed user's password is always what the login form expects.
  if (Accounts.setPasswordAsync) {
    await Accounts.setPasswordAsync(user._id, SEED_PASSWORD, { logout: false });
  } else {
    Accounts.setPassword(user._id, SEED_PASSWORD, { logout: false });
  }

  const cursor = TasksCollection.find();
  const existingCount = await cursor.countAsync();

  if (existingCount === 0) {
    await Promise.all(SEED_TASKS.map(taskText => insertTask(taskText, user)));
  }
});