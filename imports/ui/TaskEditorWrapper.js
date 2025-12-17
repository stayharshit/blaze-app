import { Template } from 'meteor/templating';
import TaskEditor from './components/TaskEditor.jsx';
import './TaskEditorWrapper.html';

Template.taskEditorWrapper.helpers({
    TaskEditor() {
        return TaskEditor;
    },
});

