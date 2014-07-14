// Brews controller for brews specific to current user
// (so far)
import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortProperties: ['createdAt'],
  sortAscending: false,

  recentBrews: function() {
    return this.get('arrangedContent').splice(0, 5);
  }.property('arrangedContent.[]')
});
