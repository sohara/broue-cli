import Ember from 'ember';

export default Ember.Route.extend({
  controllerName: 'brew',

  actions: {
    destroyRecord: function(model) {
      var _this = this;
      var modelName = model.get('constructor.typeKey').decamelize().replace("_", " ")
      if(confirm("Are you sure you want to delete this %@1?".fmt(modelName))) {
        model.destroyRecord().then(function() {
          console.log("%@1 deleted!".fmt(modelName));
        });
      }
    }
  }
});
