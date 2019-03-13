import { once } from '@ember/runloop';
import $ from 'jquery';
import Route from '@ember/routing/route';
import { pluralize } from 'ember-inflector';

export default Route.extend({
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
    let parentResource = this.parentResource;
    return this.store.find(`${parentResource}-addition`, params.resource_id);
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    var parentResource = this.parentResource;
    var items = this.store.findAll(parentResource);
    this.controllerFor(pluralize(parentResource)).set('model', items);
  },

  deactivate: function() {
    var model = this.get('controller.model');
    if (model.get('isNew')) {
      // model.deleteRecord();
    } else {
      model.rollbackAttributes();
    }
  },

  actions: {
    save: function(model) {
      model.save().then(function() {
        // this.send('closeModal');
        $('.modal').modal('hide');
      }.bind(this));
      // Need to add catch/or promise reject handling code here
      // .catch(function(reason) {
      // });
    },
    closeModal: function() {
      once(this, function() {
        this.disconnectOutlet({
          parentView: 'application',
          outlet: 'modal'
        });
        this.send('goToBrew');
      });
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
