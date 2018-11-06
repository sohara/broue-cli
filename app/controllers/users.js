import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';

export default Controller.extend({
  userSorting: ['updatedAt:desc'],
  users: sort('model', 'userSorting'),

  activeUsers: function() {
    return this.get('users').splice(0, 10);
  }.property('users.[]')
});
