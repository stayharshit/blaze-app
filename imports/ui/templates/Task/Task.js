import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { formatDate, isTaskOverdue } from '../../../lib/utils/tasks';
import '../../wrappers/PriorityBadgeWrapper';
import './Task.html';

Template.task.onCreated(function taskOnCreated() {
    this.editing = new ReactiveVar(false);
    // Store reference to main container instance
    // Traverse up the view hierarchy to find mainContainer
    let parent = Template.instance().view.parentView;

    while (parent) {
        // Check if this is the mainContainer template
        if (parent.name === 'Template.mainContainer' ||
            (parent.template && parent.template.viewName === 'Template.mainContainer')) {
            const instance = parent.templateInstance();
            if (instance && instance.showTaskEditor && instance.editingTask) {
                this.mainInstance = instance;
                break;
            }
        }

        // Also check by looking for the properties we need
        if (parent.templateInstance) {
            const instance = parent.templateInstance();
            if (instance && instance.showTaskEditor && instance.editingTask) {
                this.mainInstance = instance;
                break;
            }
        }

        parent = parent.parentView;
    }
});

Template.task.helpers({
    formatDate(date) {
        return formatDate(date);
    },
    isOverdue() {
        return isTaskOverdue(this);
    },
    isEditing() {
        return Template.instance().editing.get();
    },
});

Template.task.events({
    'click .toggle-checked'(event) {
        event.stopPropagation();
        Meteor.call('tasks.setIsChecked', this._id, !this.isChecked);
    },
    'click .delete'(event) {
        event.stopPropagation();
        if (confirm('Are you sure you want to delete this task?')) {
            Meteor.call('tasks.remove', this._id);
        }
    },
    'click .edit'(event, instance) {
        event.stopPropagation();

        // Try to find mainInstance if not already set
        if (!instance.mainInstance) {
            let parent = instance.view.parentView;
            while (parent) {
                if (parent.templateInstance) {
                    const parentInstance = parent.templateInstance();
                    if (parentInstance && parentInstance.showTaskEditor && parentInstance.editingTask) {
                        instance.mainInstance = parentInstance;
                        break;
                    }
                }
                parent = parent.parentView;
            }
        }

        if (instance.mainInstance) {
            instance.mainInstance.editingTask.set(this);
            instance.mainInstance.showTaskEditor.set(true);
        } else {
            console.error('Could not find mainContainer instance');
        }
    },
    'click .task-item'(event, instance) {
        if (event.target.closest('.task-actions') || event.target.closest('.toggle-checked')) return;

        // Try to find mainInstance if not already set
        if (!instance.mainInstance) {
            let parent = instance.view.parentView;
            while (parent) {
                if (parent.templateInstance) {
                    const parentInstance = parent.templateInstance();
                    if (parentInstance && parentInstance.showTaskEditor && parentInstance.editingTask) {
                        instance.mainInstance = parentInstance;
                        break;
                    }
                }
                parent = parent.parentView;
            }
        }

        if (instance.mainInstance) {
            instance.mainInstance.editingTask.set(this);
            instance.mainInstance.showTaskEditor.set(true);
        }
    },
});
