import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';

// Brews controller for brews specific to current user
// (so far)
export default Controller.extend({
  brewSorting: ['createdAt:desc'],
  brews: sort('model', 'brewSorting'),

  recentBrews: function() {
    return this.get('brews').splice(0, 5);
  }.property('brews.[]')
});
