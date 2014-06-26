import Ember from 'ember';

export default Ember.Route.extend({
  setupControllers: function(contoller, model) {
    this._super();
    this.controllerFor('fermentableAdditions').set('model', model.get('fermentableAdditions'));
  }
});
