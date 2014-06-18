import Ember from 'ember';

export default Ember.Route.extend({
  // clear a potentially stale error message from previous login attempts
  setupController: function(controller, model) {
    controller.set('errorMessage', null);
  },
  actions: {
    // display an error when authentication fails
    sessionAuthenticationFailed: function(error) {
      var message = error.error;
      this.controller.set('errorMessage', message);
    }
  }
});
