import Route from '@ember/routing/route';

const DEFAULTS = {
  us: {
    batchSizeGallons: 5,
    boilLossGallons: 1,
    grainTempF: 68,
    targetMashTempF: 150,
    waterGrainRatioUs: 1.5
  },
  metric: {
    batchSizeLitres: 20,
    boilLossLitres: 5,
    grainTempC: 20,
    targetMashTempC: 65,
    waterGrainRatioMetric: 3
  }
};

export default Route.extend({
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

  // Set defaults via controller so that computed property
  // setters are employed to set converted values as well
  setupController(controller) {
    this._super(...arguments);
    let measureSystem = controller.measureSystem;
    let defaults = DEFAULTS[measureSystem];
    controller.setProperties(defaults);
  },

  actions: {
    save: function(model) {
      var _this = this;
      model.save().then(function() {
        _this.transitionTo('recipe', model);
      });
    },
    cancel: function() {
      this.transitionTo('brews.index');
    }
  }
});
