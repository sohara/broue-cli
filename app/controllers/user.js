import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],
  recentBrews: [],
  currentUser: Ember.computed.alias('controllers.application.user'),

  isCurrentUser: function() {
    return this.get('currentUser.content') === this.get('model');
  }.property('currentUser.content', 'model')

});
