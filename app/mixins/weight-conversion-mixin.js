import Ember from 'ember';

export default Ember.Mixin.create({

  weightChanged: function(object, keyName) {
    Ember.run.once(this, 'synchronizeUnits', keyName);
  }.observes('model.weightGrams', 'model.weightOz'),

  synchronizeUnits: function(keyName) {
    if (this.get('model') !== null) {
      var weightGrams = parseFloat(this.get('model.weightGrams')) || 0;
      var weightOz = parseFloat(this.get('model.weightOz')) || 0;
      if (keyName === "model.weightGrams") {
        var convertedOz = weightGrams / 28.3495231;
        if (this.roundedToTwo(weightOz) !== this.roundedToTwo(convertedOz)) {
          this.set('model.weightOz', convertedOz);
        }
      }
      else if (keyName === "model.weightOz") {
        var convertedGrams = weightOz * 28.3495231;
        if (this.roundedToTwo(weightGrams) !== this.roundedToTwo(convertedGrams)) {
          this.set('model.weightGrams', convertedGrams);
        }
      }
    }
  },

  roundedToTwo: function(value) {
    return Math.round((value + 0.00001) * 100) / 100;
  }

});
