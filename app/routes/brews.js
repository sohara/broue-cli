import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function(transition) {
    this.controllerFor('login').verify(transition);
  },
  model: function() {
    return this.store.find('brew');
  }
});
