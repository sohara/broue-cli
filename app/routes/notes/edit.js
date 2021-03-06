import Route from '@ember/routing/route';
import AuthenticatedRoute from '../../mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {

  model: function(params) {
    return this.store.find('note', params.resource_id);
  },

  deactivate: function() {
    var model = this.controllerFor('notes/edit').get('model');
    if (model.get('isNew')) {
      var brew = this.modelFor('brew');
      model.deleteRecord();
      brew.get('notes').removeObject(model);
    } else {
      model.rollbackAttributes();
    }
  },

  actions: {
    save: function(model) {
      var _this = this;
      if (model.get('text.length') > 0) {

        model.save().then(function() {
          _this.transitionTo('notes.index');
        });
        // Need to add catch/or promise reject handling code here
        // .catch(function(reason) {
        // });
      } else {
        this.transitionTo('notes.index');
      }
    },

    cancel: function() {
      this.transitionTo('notes.index');
    }
  }
});
