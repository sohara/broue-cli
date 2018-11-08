import Controller, { inject as controller } from '@ember/controller';
import { oneWay } from '@ember/object/computed';

export default Controller.extend({
  brewController: controller('brew'),

  canEdit: oneWay('brewController.canEdit')
});
