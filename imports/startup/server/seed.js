import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '../../db/collections/TasksCollection';

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

const setPassword = async (userId, password) => {
  if (Accounts.setPasswordAsync) {
    await Accounts.setPasswordAsync(userId, password, { logout: false });
    return;
  }

  // Fallback for environments that still expose only the sync API.
  Accounts.setPassword(userId, password, { logout: false });
};

const ensureSeedUser = async ({ username, password }) => {
  let user = await Accounts.findUserByUsername(username);

  if (!user) {
    const userId = await Accounts.createUser({ username, password });
    user = (await Accounts.findUserByUsername(username)) ?? (await Meteor.users.findOneAsync(userId));
  }

  if (!user) {
    throw new Error(`Failed to create/find seed user "${username}"`);
  }

  await setPassword(user._id, password);
  return user;
};

const createSeedTaskDoc = ({ text, userId }) => ({
  text,
  userId,
  createdAt: new Date(),
});

const seedTasksIfEmpty = async ({ userId }) => {
  const existingCount = await TasksCollection.find().countAsync();
  if (existingCount !== 0) return;

  await Promise.all(
    SEED_TASKS.map((text) => TasksCollection.insertAsync(createSeedTaskDoc({ text, userId }))),
  );
};

Meteor.startup(async () => {
  try {
    // Wait a bit for MongoDB to be ready
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = await ensureSeedUser({ username: SEED_USERNAME, password: SEED_PASSWORD });
    await seedTasksIfEmpty({ userId: user._id });
  } catch (error) {
    console.error('Error during database seeding:', error);
    // Don't crash the app if seeding fails - it might be a connection issue
  }
});
