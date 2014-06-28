import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(contoller, model) {
    this._super();
    this.controllerFor('fermentableAdditions').set('model', model.get('fermentableAdditions'));
    this.controllerFor('hopAdditions').set('model', model.get('hopAdditions'));
    this.controllerFor('yeastAdditions').set('model', model.get('yeastAdditions'));
  }
});
