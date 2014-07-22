import Ember from 'ember';

export default Ember.Route.extend({
  controllerName: 'notes',

  actions: {
    destroyRecord: function(model) {
      var _this = this;
      if (confirm("Are you sure you want to destroy this note?")) {
        model.destroyRecord().then(function() {
          _this.transitionTo('notes.index');
        }).
        catch(function(response) {
        });
      }
    }
  }
});
