import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],
  email: null,
  password: null,
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

  // Should set errorMessage to null as soon as user activates
  // either of the fields?
  actions: {
    signIn: function() {
      this.setProperties({
        errorMessage: null,
        isProcessing: true
      });
      Ember.$.ajax("/users/sign_in", {
        type: "POST",
        data: JSON.stringify(this.getProperties('email', 'password'))
      }).then(function(userJson) {
        // Must wrap promise resolution in Ember.run for Ember testing
        // (doesn't like async stuff)
        Ember.run(this, function() {
          this.setProperties({
            session: userJson,
            isProcessing: false,
            email: null,
            password: null
          });

          var user = this.store.push('user', userJson.user)
          this.get('controllers.application').set('user', user);

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
