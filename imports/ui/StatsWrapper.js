import { Template } from 'meteor/templating';
import StatsDashboard from './components/StatsDashboard.jsx';
import './StatsWrapper.html';

Template.statsWrapper.helpers({
    StatsDashboard() {
        return StatsDashboard;
    },
});

