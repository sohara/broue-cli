import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render({
      into: 'application',
      outlet: 'modal'
    });
  },

  model: function(params) {
    return this.store.find('fermentable-addition', params.fermentable_id);
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    var fermentables = this.store.find('fermentable');
    this.controllerFor('fermentables').set('model', fermentables);
  },

  deactivate: function() {
    var model = this.get('controller.model');
    model.rollback();
  },

  actions: {
    save: function(model) {
      var _this = this;
      model.save().then(function() {
        _this.disconnectOutlet({
          parentView: 'application',
          outlet: 'modal'
        });
// _this.send('goToBrew');
      });
    },
    closeModal: function() {
      this.disconnectOutlet({
        parentView: 'application',
        outlet: 'modal'
      });
      this.send('goToBrew');
    },
    cancel: function() {
      this.send('closeModal');
    },
    goToBrew: function() {
      var brew = this.modelFor('brew');
      this.transitionTo('recipe', brew);
    }

  }

});
