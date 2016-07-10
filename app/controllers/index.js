import Ember from 'ember';
const { computed, inject } = Ember;
const { alias } = computed;

export default Ember.Controller.extend({
  brewsController: inject.controller('brews'),
  usersController: inject.controller('users'),

  recentBrews: alias('brewsController.recentBrews'),
  activeUsers: alias('usersController.activeUsers')
});
