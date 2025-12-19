import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { TasksCollection } from '../../../db/collections/TasksCollection';
import { getUser, getUserId, isUserLogged } from '../../../lib/utils/auth';
import { buildTasksSelector, buildIncompleteSelector } from '../../../lib/utils/tasks';
import './App.html';
// Import other templates
import '../Login/Login';
import '../Task/Task';
// Import wrappers
import '../../wrappers/StatsWrapper';
import '../../wrappers/SearchWrapper';
import '../../wrappers/TaskEditorWrapper';

// Template state keys
const HIDE_COMPLETED_KEY = 'hideCompleted';
const IS_LOADING_KEY = 'isLoading';
const SHOW_STATS_KEY = 'showStats';
const SEARCH_TERM_KEY = 'searchTerm';
const PRIORITY_FILTER_KEY = 'priorityFilter';

// Helper functions for template instance state
const getHideCompleted = (instance) => Boolean(instance.state.get(HIDE_COMPLETED_KEY));
const getShowStats = (instance) => Boolean(instance.state.get(SHOW_STATS_KEY));
const getSearchTerm = (instance) => {
    // Try ReactiveVar first, then fallback to state dictionary
    if (instance.searchTerm) {
        return instance.searchTerm.get() || '';
    }
    return instance.state.get(SEARCH_TERM_KEY) || '';
};
const getPriorityFilter = (instance) => instance.state.get(PRIORITY_FILTER_KEY) || '';

Template.mainContainer.onCreated(function mainContainerOnCreated() {
    this.state = new ReactiveDict();
    this.stats = new ReactiveVar(null);
    this.editingTask = new ReactiveVar(null);
    this.showTaskEditor = new ReactiveVar(false);
    this.searchTerm = new ReactiveVar('');

    const handler = Meteor.subscribe('tasks');
    this.tasksLoadingComputation = Tracker.autorun(() => {
        this.state.set(IS_LOADING_KEY, !handler.ready());
    });

    // Load stats reactively - compute directly from collection for instant updates
    this.statsComputation = Tracker.autorun(() => {
        const userId = getUserId();
        if (userId && handler.ready()) {
            // Create reactive dependencies on all task counts
            // This ensures stats update instantly when tasks are checked/unchecked
            const total = TasksCollection.find({ userId }).count();
            const completed = TasksCollection.find({ userId, isChecked: true }).count();
            const incomplete = TasksCollection.find({ userId, isChecked: { $ne: true } }).count();
            const highPriority = TasksCollection.find({ userId, priority: 'high', isChecked: { $ne: true } }).count();

            // Update stats immediately (no async call needed)
            this.stats.set({ total, completed, incomplete, highPriority });
        }
    });
});

Template.mainContainer.onDestroyed(function mainContainerOnDestroyed() {
    this.tasksLoadingComputation?.stop();
    this.statsComputation?.stop();
});

Template.mainContainer.events({
    'click #hide-completed-button'(event, instance) {
        instance.state.set(HIDE_COMPLETED_KEY, !getHideCompleted(instance));
    },
    'click .logout-btn'(event) {
        event.stopPropagation();
        Meteor.logout();
    },
    'click #toggle-stats-button'(event, instance) {
        instance.state.set(SHOW_STATS_KEY, !getShowStats(instance));
    },
    'change #priority-filter'(event, instance) {
        const priority = event.target.value;
        instance.state.set(PRIORITY_FILTER_KEY, priority || '');
    },
});

Template.mainContainer.helpers({
    tasks() {
        const instance = Template.instance();
        const userId = getUserId();

        if (!userId) {
            return [];
        }

        // Make this helper reactive to search term changes
        // getSearchTerm already accesses the ReactiveVar, creating a reactive dependency
        const searchTerm = getSearchTerm(instance);
        const hideCompleted = getHideCompleted(instance);
        const priorityFilter = getPriorityFilter(instance);

        const selector = buildTasksSelector({
            userId,
            hideCompleted,
            searchTerm,
            priorityFilter,
        });

        if (!selector) {
            return [];
        }

        return TasksCollection.find(selector, { sort: { createdAt: -1 } }).fetch();
    },
    hideCompleted() {
        return getHideCompleted(Template.instance());
    },
    showStats() {
        return getShowStats(Template.instance());
    },
    incompleteCount() {
        const userId = getUserId();
        if (!userId) {
            return '';
        }

        const selector = buildIncompleteSelector({ userId });
        const incompleteTasksCount = TasksCollection.find(selector).count();
        return incompleteTasksCount ? `(${incompleteTasksCount})` : '';
    },
    isUserLogged() {
        // Explicitly access Meteor.userId() to create reactive dependency
        return Boolean(Meteor.userId());
    },
    getUser() {
        // Explicitly access Meteor.user() to create reactive dependency
        return Meteor.user();
    },
    isLoading() {
        return Boolean(Template.instance().state.get(IS_LOADING_KEY));
    },
    stats() {
        return Template.instance().stats.get();
    },
    editingTask() {
        return Template.instance().editingTask.get();
    },
    showTaskEditor() {
        return Template.instance().showTaskEditor.get();
    },
    handleSearchCallback() {
        const instance = Template.instance();
        // Return a function that updates the search term
        return (searchTerm) => {
            if (instance.searchTerm) {
                instance.searchTerm.set(searchTerm || '');
            }
            if (instance.state) {
                instance.state.set(SEARCH_TERM_KEY, searchTerm || '');
            }
        };
    },
    handleTaskSave() {
        const instance = Template.instance();
        // Return a function that will be called by the React component
        return (updates) => {
            // Safety check: ensure updates is an object
            if (!updates || typeof updates !== 'object') {
                return;
            }

            const editingTask = instance.editingTask.get();

            if (editingTask) {
                Meteor.call('tasks.update', editingTask._id, updates, (error) => {
                    if (!error) {
                        instance.editingTask.set(null);
                        instance.showTaskEditor.set(false);
                    }
                });
            } else {
                Meteor.call('tasks.insert', updates.text, updates.priority, (error) => {
                    if (!error) {
                        instance.showTaskEditor.set(false);
                    }
                });
            }
        };
    },
    handleTaskCancel() {
        const instance = Template.instance();
        // Return a function that will be called by the React component
        return () => {
            instance.editingTask.set(null);
            instance.showTaskEditor.set(false);
        };
    },
});

Template.form.onCreated(function formOnCreated() {
    // Store reference to main container instance
    let parent = Template.instance().view.parentView;
    while (parent && parent.templateInstance) {
        const instance = parent.templateInstance();
        if (instance && instance.showTaskEditor) {
            this.mainInstance = instance;
            break;
        }
        parent = parent.parentView;
    }
});

Template.form.events({
    'submit .task-form'(event) {
        event.preventDefault();

        const { target } = event;
        const text = target.text.value;
        const priority = target.priority.value || 'medium';

        if (text.trim()) {
            Meteor.call('tasks.insert', text.trim(), priority);
            target.text.value = '';
            target.priority.value = ''; // Reset to placeholder
        }
    },
});
