import Ember from 'ember';

export default Ember.Route.extend({
  controllerName: 'brews/edit',

  model: function() {
    return this.store.createRecord('brew');
  },

  deactivate: function() {
    var model = this.get('controller.model');
    if (model.get('isNew')) {
      model.deleteRecord();
    }
  },

  actions: {
    save: function(model) {
      var _this = this;
      model.save().then(function() {
        _this.transitionTo('brews.show', model);
      });
    },
    cancel: function() {
      this.transitionTo('brews.index');
    }
  }
});
