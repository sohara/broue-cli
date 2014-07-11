import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    return this.controllerFor('application').get('user');
  },


  setupController: function(controller, model) {
    this._super(controller, model);
    if (this.controllerFor('brews/index').get('length') == 0) {
      var brews = this.store.find('brew');
      this.controllerFor('brews/index').set('model', brews);
    }
  }

});
