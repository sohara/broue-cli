import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function(transition) {
    this.controllerFor('login').verify(transition);
  },
  model: function() {
    return this.store.find('brew');
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    var styles = this.store.find('style');
    this.controllerFor('styles').set('model', styles);
  }

});
