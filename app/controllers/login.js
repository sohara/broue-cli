import Ember from 'ember';

export default Ember.Controller.extend({
  email: null,
  password: null,
  errorMessage: null,
  previousTransition: null,

  verify: function(transition) {
    if (!this.get('currentUser')) {
      this.set('previousTransition', transition);
      this.transitionToRoute('login');
    }
  },

  actions: {
    signIn: function() {
      this.set('errorMessage', null);

      $.ajax("/users/sign_in", {
        type: "POST",
        data: JSON.stringify(this.getProperties('email', 'password'))
      }).then(function(userJson) {
        this.set('currentUser', userJson);

        var previousTransition = this.get('previousTransition');
        if (previousTransition) {
          previousTransition.retry();
        } else {
          this.transitionTo('folder', 'inbox');
        }
      }.bind(this), function(xhr) {
        this.set('errorMessage', xhr.responseJSON.message);
      }.bind(this));
    }
  }
});
