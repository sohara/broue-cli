import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
    this.controllerFor('fermentableAdditions').set('model', model.get('fermentableAdditions'));
    this.controllerFor('hopAdditions').set('model', model.get('hopAdditions'));
    this.controllerFor('yeastAdditions').set('model', model.get('yeastAdditions'));
  }
});
