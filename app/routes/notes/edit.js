import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return this.store.find('note', params.resource_id);
  },
  deactivate: function() {
    var model = this.controllerFor('notes/edit').get('model');
    if (model.get('isNew')) {
      model.deleteRecord();
    } else {
      model.rollback();
    }
  },
  actions: {
    save: function(model) {
      var _this = this;
      model.save().then(function() {
        _this.transitionTo('notes.index');
      });
      // Need to add catch/or promise reject handling code here
      // .catch(function(reason) {
      // });
    },
    cancel: function() {
      this.transitionTo('notes.index');
    }
  }
});
