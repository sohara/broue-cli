import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['fermentables', 'application'],

  measureSystem: Ember.computed.alias('controllers.application.measureSystem'),

  fermentables: function() {
    return this.get('controllers.fermentables');
  }.property('controllers.fermentables'),

  // Perhaps shouldn't observe measureSystem
  weightChanged: function(object, keyName) {
    console.log("Weight changed fired");
    Ember.run.once(this, 'synchronizeUnits', keyName);
  }.observes('weightGrams', 'weightOz'),

  synchronizeUnits: function(keyName) {
    if (this.get('content') !== null) {
      var weightGrams = parseFloat(this.get('weightGrams')) || 0;
      var weightOz = parseFloat(this.get('weightOz')) || 0;
      if (keyName === "weightGrams") {
        var convertedOz = weightGrams / 28.3495231;
        if (this.roundedToTwo(weightOz) !== this.roundedToTwo(convertedOz)) {
          this.set('weightOz', convertedOz);
        }
      }
      else if (keyName === "weightOz") {
        var convertedGrams = weightOz * 28.3495231;
        if (this.roundedToTwo(weightGrams) !== this.roundedToTwo(convertedGrams)) {
          this.set('weightGrams', convertedGrams);
        }
      }
    }
  },

  roundedToTwo: function(value) {
    return Math.round((value + 0.00001) * 100) / 100;
  }
});
