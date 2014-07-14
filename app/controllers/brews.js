import Ember from 'ember';

// Brews controller for brews on index page
// Publcly viewable, not specific to current user
export default Ember.ArrayController.extend({
  sortProperties: ['createdAt'],
  sortAscending: false,

  recentBrews: function() {
    return this.get('arrangedContent').splice(0, 10);
  }.property('arrangedContent.[]')
});
