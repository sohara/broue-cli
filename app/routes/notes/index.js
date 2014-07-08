import Ember from 'ember';

export default Ember.Route.extend({
  controllerName: 'notes',

  actions: {
    destroyRecord: function(model) {
      var _this = this;
      model.destroyRecord().then(function() {
        _this.transitionTo('notes.index');
      }).
      catch(function(response) {
        console.log(response);
      });
    }
  }
});
