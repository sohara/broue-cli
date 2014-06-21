import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['login'],
  user: Ember.computed.alias('controllers.login.currentUser'),

  actions: {
    logout: function() {
      this.set('user', null);
      this.transitionToRoute('login');
    }
  }
});
