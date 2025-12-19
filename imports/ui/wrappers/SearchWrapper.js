import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import SearchBar from '../components/SearchBar';
import './SearchWrapper.html';

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
