import Ember from 'ember';
const { computed, inject } = Ember;
const { oneWay } = computed;

export default Ember.Controller.extend({
  brewController: inject.controller('brew'),

  canEdit: oneWay('brewController.canEdit')
});
