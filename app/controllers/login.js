import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],
  email: null,
  password: null,
  passwordConfirmation: null,
  username: null,
  errorMessage: null,
  isProcessing: false,
  previousTransition: null,

  // Computed property setter and getter
  session: function(key, value) {
   if (arguments.length > 1) {
     localStorage.setItem('user', JSON.stringify(value));
     return value;
   }
   return JSON.parse(localStorage.getItem('user') || "null");
  }.property(),

  verify: function(transition) {
    if (!this.get('session')) {
      this.set('previousTransition', transition);
      this.transitionToRoute('login');
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
    Ember.run(this, function() {
      this.setProperties({
        session: userJson,
        isProcessing: false,
        email: null,
        password: null
      });

      var user = this.store.push('user', userJson.user);
      this.get('controllers.application').set('user', user);

      var previousTransition = this.get('previousTransition');
      if (previousTransition) {
        previousTransition.retry();
      } else {
        this.transitionToRoute('brews.index');
      }
    });
  },

  handleError: function(xhr) {
    Ember.run(this, function() {
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
      Ember.$.ajax("/users/sign_in.json", {
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
      Ember.$.ajax("/users.json", {
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
   },
  }
});
