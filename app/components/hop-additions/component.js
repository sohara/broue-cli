import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  weightGrams: computed('brew.positiveHopAdditions.@each.weightGrams', function() {
    var weightGrams = this.get('brew.positiveHopAdditions').reduce(function(accum, addition) {
      return accum + parseFloat(addition.get('weightGrams'));
    }, 0);
    return weightGrams;
  }),

  weightOz: computed('brew.positiveHopAdditions.@each.weightOz', function() {
    var weightOz = this.get('brew.positiveHopAdditions').reduce(function(accum, addition) {
      return accum + parseFloat(addition.get('weightOz'));
    }, 0);
    return weightOz;
  })
});
