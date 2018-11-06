import Route from '@ember/routing/route';

export default Route.extend({
  controllerName: 'notes',

  actions: {
    destroyRecord: function(model) {
      var _this = this;
      if (confirm("Are you sure you want to destroy this note?")) {
        model.destroyRecord().then(function() {
          _this.transitionTo('notes.index');
        });
        // Need to add catch/or promise reject handling code here
        // .catch(function(reason) {
        // });
      }
    }
  }
});
