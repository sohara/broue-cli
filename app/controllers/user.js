import Ember from 'ember';
const { computed, inject } = Ember;
const { alias, oneWay } = computed;

export default Ember.Controller.extend({
  applicationController: inject.controller('application'),
  brewIndexController: inject.controller('brews/index'),
  recentBrews: oneWay('brewIndexController.recentBrews'),
  currentUser: alias('applicationController.user'),

  isCurrentUser: function() {
    return this.get('currentUser.content') === this.get('model');
  }.property('currentUser.content', 'model')

});
