import Ember from 'ember';

export default Ember.Controller.extend({
  email: null,
  password: null,
  errorMessage: null,
  isProcessing: false,
  previousTransition: null,

  // Computed property setter and getter
  currentUser: function(key, value) {
   if (arguments.length > 1) {
     localStorage.setItem('user', JSON.stringify(value));
     return value;
   }
   return JSON.parse(localStorage.getItem('user') || "null");
  }.property(),

  verify: function(transition) {
    if (!this.get('currentUser')) {
      this.set('previousTransition', transition);
      this.transitionToRoute('login');
    }
  },

  focusIn: function() {
    debugger;
  },

  // Should set errorMessage to null as soon as user activates
  // either of the fields?
  actions: {
    signIn: function() {
      this.setProperties({
        errorMessage: null,
        isProcessing: true
      });
      $.ajax("/users/sign_in", {
        type: "POST",
        data: JSON.stringify(this.getProperties('email', 'password'))
      }).then(function(userJson) {
        // Must wrap promise resolution in Ember.run for Ember testing
        // (doesn't like async stuff)
        Ember.run(this, function() {
          this.setProperties({
            currentUser: userJson,
            isProcessing: false,
            email: null,
            password: null
          });

          var previousTransition = this.get('previousTransition');
          if (previousTransition) {
            previousTransition.retry();
          } else {
            this.transitionToRoute('brews.index');
          }
        });
      }.bind(this), function(xhr) {
        Ember.run(this, function() {
          this.setProperties({
            errorMessage: xhr.responseJSON.message,
            isProcessing: false
          });
        });
      }.bind(this));
    },
    resetErrorMessage: function() {
      this.set('errorMessage', null);
    }
  }
});
