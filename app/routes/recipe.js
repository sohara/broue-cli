import Ember from 'ember';

export default Ember.Route.extend({
  controllerName: 'brew',

  actions: {
    destroyRecord: function(model) {
      var _this = this;
      var modelName = model.get('constructor.modelName').decamelize().replace("_", " ");
      if (confirm(`Are you sure you want to delete this ${modelName}?`)) {
        model.destroyRecord().then(function() {
          _this.flash.render(`${modelName.capitalize()} successfully destroyed`);
        });
      }
    }
  }
});
