import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import SearchBar from './components/SearchBar.jsx';
import './SearchWrapper.html';

// Import the shared search term variable from App.js
// We'll access it through the parent template instance
Template.searchWrapper.helpers({
    SearchBar() {
        return SearchBar;
    },
    onSearch() {
        // Get the callback function passed from the parent template
        const callback = Template.currentData().onSearchCallback;
        if (callback && typeof callback === 'function') {
            return callback;
        }
        // Fallback: try to find parent instance
        let parent = Template.instance().view.parentView;
        while (parent && parent.templateInstance) {
            const instance = parent.templateInstance();
            if (instance && instance.searchTerm) {
                return (searchTerm) => {
                    instance.searchTerm.set(searchTerm || '');
                    if (instance.state) {
                        instance.state.set('searchTerm', searchTerm || '');
                    }
                };
            }
            parent = parent.parentView;
        }
        return () => { }; // No-op fallback
    },
});

