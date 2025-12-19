import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './Login.html';

Template.login.events({
  'submit .login-form'(e) {
    e.preventDefault();

    const target = e.target;

    const usernameInput = target.querySelector('[name="username"]');
    const passwordInput = target.querySelector('[name="password"]');

    if (!usernameInput || !passwordInput) {
      console.error('Could not find username or password input');
      return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    console.log('Attempting login for user:', username);

    Meteor.loginWithPassword(username, password, (error) => {
      if (error) {
        console.error('Login error:', error);
        alert(`Login failed: ${error.reason || error.message}`);
      } else {
        console.log('Login successful, userId:', Meteor.userId());
        // The reactive system should automatically update the UI
        // because Meteor.userId() is reactive and isUserLogged helper will re-run
      }
    });
  }
});
