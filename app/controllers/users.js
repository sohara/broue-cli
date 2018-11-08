import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';

export default Controller.extend({
  /* eslint ember/avoid-leaking-state-in-ember-objects: "off" */
  userSorting: ['updatedAt:desc'],
  users: sort('model', 'userSorting'),

  activeUsers: computed('users.[]', function() {
    return this.users.splice(0, 10);
  })
});
