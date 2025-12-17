import { Template } from 'meteor/templating';
import PriorityBadge from './components/PriorityBadge.jsx';
import './PriorityBadgeWrapper.html';

Template.priorityBadgeWrapper.helpers({
    PriorityBadge() {
        return PriorityBadge;
    },
});

