import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';

// Brews controller for brews on index page
// Publcly viewable, not specific to current user
export default Controller.extend({
  brewSorting: ['createdAt:desc'],
  brews: sort('model', 'brewSorting'),

  recentBrews: function() {
    return this.get('brews').splice(0, 10);
  }.property('brews.[]')

});
