import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './Task.html';
import './PriorityBadgeWrapper.js';

Template.task.onCreated(function taskOnCreated() {
    this.editing = new ReactiveVar(false);
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

Template.task.helpers({
    formatDate(date) {
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
    },
    isOverdue() {
        if (!this.dueDate || this.isChecked) return false;
        return new Date(this.dueDate) < new Date();
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
        if (instance.mainInstance) {
            instance.mainInstance.editingTask.set(this);
            instance.mainInstance.showTaskEditor.set(true);
        }
    },
    'click .task-item'(event, instance) {
        if (event.target.closest('.task-actions') || event.target.closest('.toggle-checked')) return;
        if (instance.mainInstance) {
            instance.mainInstance.editingTask.set(this);
            instance.mainInstance.showTaskEditor.set(true);
        }
    },
});