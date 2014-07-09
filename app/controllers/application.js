import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['login'],
  session: Ember.computed.alias('controllers.login.session'),
  user: function(key, value) {
   if (arguments.length > 1) {
     return value;
   }
   if ( this.get('session') !== null && typeof(this.get('session')) != 'undefined') {
     return this.store.find('user', this.get('session.user_id'));
   }
  }.property('session'),

  actions: {
    logout: function() {
      this.setProperties({
        session: null,
        user: null});
      this.transitionToRoute('login');
    }
  }
});
