import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';

// Brews controller for brews specific to current user
// (so far)
export default Controller.extend({
  /* eslint ember/avoid-leaking-state-in-ember-objects: "off" */
  brewSorting: ['createdAt:desc'],
  brews: sort('model', 'brewSorting'),

  recentBrews: computed('brews.[]', function() {
    return this.get('brews').splice(0, 5);
  })
});
