import Ember from 'ember';

export default Ember.Route.extend({
  // Reusable route for editing additions, e.g. a parentResource
  // property of 'fermentable' edits a fermentable addition and sets
  // the content of the fermentables controller to all fermentables
  // found in the store
  parentResource: null,

  renderTemplate: function() {
    this.render({
      into: 'application',
      outlet: 'modal'
    });
  },

  model: function(params) {
    return this.store.find('%@1-addition'.fmt(this.get('parentResource')), params.resource_id);
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    var parentResource = this.get('parentResource');
    var items = this.store.find(parentResource);
    var inflector = new Ember.Inflector(Ember.Inflector.defaultRules);
    this.controllerFor(inflector.pluralize(parentResource)).set('model', items);
  },

  deactivate: function() {
    var model = this.get('controller.model');
    if (model.get('isNew')) {
      // model.deleteRecord();
    } else {
      model.rollback();
    }
  },

  actions: {
    save: function(model) {
      var _this = this;
      model.save().then(function() {
        _this.send('closeModal');
      }).
      catch(function(reason) {
      });
    },
    closeModal: function() {
      Ember.$('.modal').modal('hide');
      Ember.run.later(this, function() {
        this.disconnectOutlet({
          parentView: 'application',
          outlet: 'modal'
        });
        this.send('goToBrew');
      }, 400);
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
