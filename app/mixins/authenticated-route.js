import Ember from 'ember';

export default Ember.Mixin.create({
  beforeModel: function(transition) {
    this.controllerFor('login').verify(transition);
  },
});
