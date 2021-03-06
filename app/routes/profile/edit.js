import Route from '@ember/routing/route';

export default Route.extend({
  controllerName: 'user',

  deactivate: function() {
    var model = this.get('controller.model');
    model.rollbackAttributes();
  },

  actions: {
    save: function(model) {
      var _this = this;
      model.save().then(function() {
        _this.transitionTo('profile.show');
      });
    },
    cancel: function() {
      this.transitionTo('profile.show');
    }
  }

});
