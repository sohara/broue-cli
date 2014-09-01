import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['brews/index', 'application'],
  currentUser: Ember.computed.alias('controllers.application.user'),

  recentBrews: function() {
    return this.get('controllers.brews/index.recentBrews');
  }.property('controllers.brews/index.recentBrews'),

  isCurrentUser: function() {
    return this.get('currentUser.content') === this.get('model');
  }.property('currentUser.content', 'model')
});
