import Ember from 'ember';

export default Ember.Route.extend({
  controllerName: 'profile',

  deactivate: function() {
    var model = this.get('controller.model');
    model.rollback();
  },

  actions: {
    save: function(model) {
      var _this = this;
      model.save().then(function() {
        _this.transitionTo('profile.show');
      });
    },
    cancel: function(model) {
      this.transitionTo('profile.show');
    }
  }

});
