import Component from '@ember/component';
import EditTableView from '../../mixins/edit-table-view';
import { computed } from '@ember/object';

export default Component.extend(EditTableView, {

  weightGrams: computed('brew.positiveFermentableAdditions.@each.weightGrams', function() {
    var weightGrams = this.get('brew.positiveFermentableAdditions').reduce(function(accum, addition) {
      return accum + parseFloat(addition.get('weightGrams'));
    }, 0);
    return weightGrams;
  }),

  weightOz: computed('brew.positiveFermentableAdditions.@each.weightOz', function() {
    var weightOz = this.get('brew.positiveFermentableAdditions').reduce(function(accum, addition) {
      return accum + parseFloat(addition.get('weightOz'));
    }, 0);
    return weightOz;
  })

});
