import Controller, { inject as controller } from '@ember/controller';
import { alias } from '@ember/object/computed';

export default Controller.extend({
  brewsController: controller('brews'),
  usersController: controller('users'),

  recentBrews: alias('brewsController.recentBrews'),
  activeUsers: alias('usersController.activeUsers')
});
