import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['brews', 'users'],

  recentBrews: Ember.computed.alias('controllers.brews.recentBrews'),
  activeUsers: Ember.computed.alias('controllers.users.activeUsers')
});
