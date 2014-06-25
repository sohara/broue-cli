import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.modelFor('brew');
  },
  deactivate: function() {
    var model = this.get('controller.model');
    model.rollback();
  },
  actions: {
    save: function(model) {
      var _this = this;
      model.save().then(function() {
        _this.transitionTo('brew_day.index', model);
      });
    },
    cancel: function(model) {
      this.transitionTo('brew_day.index', model);
    }
  }
});
