import Controller, { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';
import { oneWay, alias } from '@ember/object/computed';

export default Controller.extend({
  applicationController: controller('application'),
  brewIndexController: controller('brews/index'),
  recentBrews: oneWay('brewIndexController.recentBrews'),
  currentUser: alias('applicationController.user'),

  isCurrentUser: computed('currentUser.content', 'model', function() {
    return this.get('currentUser.content') === this.model;
  })

});
