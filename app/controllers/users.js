import Ember from 'ember';
const { computed } = Ember;
const { sort } = computed;

export default Ember.Controller.extend({
  userSorting: ['updatedAt:desc'],
  users: sort('model', 'userSorting'),

  activeUsers: function() {
    return this.get('users').splice(0, 10);
  }.property('users.[]')
});
