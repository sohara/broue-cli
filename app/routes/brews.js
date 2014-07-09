import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function(transition) {
    this.controllerFor('login').verify(transition);
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    var styles = this.store.find('style');
    this.controllerFor('styles').set('model', styles);
    var brews = this.store.find('brew');
    this.controllerFor('brews/index').set('model', brews);
  }

});
