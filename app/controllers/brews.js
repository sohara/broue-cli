import Ember from 'ember';
const { computed } = Ember;
const { sort } = computed;

// Brews controller for brews on index page
// Publcly viewable, not specific to current user
export default Ember.Controller.extend({
  brewSorting: ['createdAt:desc'],
  brews: sort('model', 'brewSorting'),

  recentBrews: function() {
    return this.get('brews').splice(0, 10);
  }.property('brews.[]')

});
