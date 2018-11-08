import { inject as service } from '@ember/service';
import $ from 'jquery';
import { run } from '@ember/runloop';
import Controller, { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  applicationController: controller('application'),
  flash: service(),
  email: null,
  password: null,
  passwordConfirmation: null,
  username: null,
  errorMessage: null,
  isProcessing: false,
  previousTransition: null,

  // Computed property setter and getter
  session: computed({
    get () {
      return JSON.parse(localStorage.getItem('user') || "null");
    },
    set (key, user) {
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
  }),

  verify: function(transition) {
    if (!this.session) {
      var _this = this;
      this.set('previousTransition', transition);
      this.transitionToRoute('login').then(function() {
        _this.get('flash').render("Please login or sign up to continue.", "warning");
      });
    }
  },

  // Set properties betweens submitting and server response
  beginSubmission: function() {
    this.setProperties({
      errorMessage: null,
      isProcessing: true
    });
  },

  // On successful login or signup, assign session, push User into store
  // and transition to desired route, or default
  handleSuccess: function(userJson) {
    // Must wrap promise resolution in Ember.run for Ember testing
    // (doesn't like async stuff)
    // NOTE: Probably can remove this after upgrading to Ember 1.6
    run(this, function() {
      this.setProperties({
        session: userJson,
        isProcessing: false,
        email: null,
        password: null
      });

      let normalizedUserJSON = this.store.normalize('user', userJson.user);
      var user = this.store.push(normalizedUserJSON);
      this.applicationController.set('user', user);

      var previousTransition = this.previousTransition;
      if (previousTransition) {
        previousTransition.retry();
      } else {
        this.transitionToRoute('brews.index');
      }
    });
  },

  handleError: function(xhr) {
    run(this, function() {
      this.setProperties({
        errorMessage: xhr.responseJSON.message,
        isProcessing: false
      });
    });
  },

  // Should make these actions more dry or at least store the promise
  // handlers in a var or property
  actions: {
    signIn: function() {
      this.beginSubmission();
      $.ajax("/users/sign_in.json", {
        type: "POST",
        data: JSON.stringify(this.getProperties('email', 'password'))
      }).then(function(userJson) {
        this.handleSuccess(userJson);
      }.bind(this), function(xhr) {
        this.handleError(xhr);
      }.bind(this));
    },

    signUp: function() {
      this.beginSubmission();
      $.ajax("/users.json", {
        type: "POST",
        data: JSON.stringify(this.getProperties('email', 'password',
              'passwordConfirmation', 'username'))
      }).then(function(userJson) {
        this.handleSuccess(userJson);
      }.bind(this), function(xhr) {
        this.handleError(xhr);
      }.bind(this));
    },
    resetErrorMessage: function() {
      this.set('errorMessage', null);
    }
  }
});
