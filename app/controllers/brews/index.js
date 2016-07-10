import Ember from 'ember';
const { computed } = Ember;
const { sort } = computed;

// Brews controller for brews specific to current user
// (so far)
export default Ember.Controller.extend({
  brewSorting: ['createdAt:desc'],
  brews: sort('model', 'brewSorting'),

  recentBrews: function() {
    return this.get('brews').splice(0, 5);
  }.property('brews.[]')
});
