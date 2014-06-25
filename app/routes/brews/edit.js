import Ember from 'ember';

export default Ember.Route.extend({
  returnRoute: 'brew.show',

  model: function(params) {
    return this.store.find('brew', params.brew_id);
  },
  deactivate: function() {
    var model = this.get('controller.model');
    model.rollback();
  },
  actions: {
    save: function(model) {
      var _this = this;
      model.save().then(function() {
        _this.transitionTo(_this.get('returnRoute'), model);
      });
    },
    cancel: function(model) {
      this.transitionTo(this.get('returnRoute'), model);
    }
  }
});
