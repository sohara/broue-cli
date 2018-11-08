import { once } from '@ember/runloop';
import { observer } from '@ember/object';
import Mixin from '@ember/object/mixin';

export default Mixin.create({

  weightChanged: observer('model.weightGrams', 'model.weightOz', function(object, keyName) {
    once(this, 'synchronizeUnits', keyName);
  }),

  synchronizeUnits: function(keyName) {
    if (this.model !== null) {
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
