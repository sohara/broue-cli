import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
    this.controllerFor('fermentableAdditions').set('model', model.get('fermentableAdditions'));
    this.controllerFor('hopAdditions').set('model', model.get('hopAdditions'));
    // this.controllerFor('yeastAdditions').set('model', model.get('yeastAdditions'));
  },

  actions: {
    destroyBrew: function(model) {
      var _this = this;
      if(confirm("Are you sure you want to delete this brew?")) {
        model.destroyRecord().then(function() {
          _this.flash.render("Brew successfully destroyed");
          _this.transitionTo('index');
        });
      }
    }
  }
});
