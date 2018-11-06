import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { computed } from '@ember/object';

// Brews controller for brews on index page
// Publcly viewable, not specific to current user
export default Controller.extend({
  /* eslint ember/avoid-leaking-state-in-ember-objects: "off" */
  brewSorting: ['createdAt:desc'],
  brews: sort('model', 'brewSorting'),

  recentBrews: computed('brews.[]', function() {
    return this.get('brews').splice(0, 10);
  })

});
