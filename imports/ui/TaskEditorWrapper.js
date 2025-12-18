import { Template } from 'meteor/templating';
import TaskEditor from './components/TaskEditor.jsx';
import './TaskEditorWrapper.html';

Template.taskEditorWrapper.onCreated(function taskEditorWrapperOnCreated() {
    // Store the callbacks from the data context and ensure they're functions
    const data = Template.currentData();

    // If the callback is a function (already returned from handleTaskSave), use it directly
    // Otherwise, if it's a helper function, call it to get the actual callback
    if (data.onSave && typeof data.onSave === 'function') {
        this.onSaveCallback = data.onSave;
    } else {
        // Fallback: try to call it if it's a helper
        this.onSaveCallback = typeof data.onSave === 'function' ? data.onSave : (() => { });
    }

    if (data.onCancel && typeof data.onCancel === 'function') {
        this.onCancelCallback = data.onCancel;
    } else {
        this.onCancelCallback = typeof data.onCancel === 'function' ? data.onCancel : (() => { });
    }

});

Template.taskEditorWrapper.helpers({
    TaskEditor() {
        return TaskEditor;
    },
    onSave() {
        const instance = Template.instance();
        const callback = instance.onSaveCallback;
        // Always return a function - either the stored callback or a no-op
        return callback || (() => { });
    },
    onCancel() {
        const instance = Template.instance();
        const callback = instance.onCancelCallback;
        // Always return a function - either the stored callback or a no-op
        return callback || (() => { });
    },
});

