import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortProperties: ['updatedAt'],
  sortAscending: false,

  activeUsers: function() {
    return this.get('arrangedContent').splice(0, 10);
  }.property('arrangedContent.[]')
});
