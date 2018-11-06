import Component from '@ember/component';
import EditTableView from '../../mixins/edit-table-view';

export default Component.extend(EditTableView, {
  weightGrams: function() {
    var weightGrams = this.get('brew.positiveHopAdditions').reduce(function(accum, addition) {
      return accum + parseFloat(addition.get('weightGrams'));
    }, 0);
    return weightGrams;
  }.property('brew.positiveHopAdditions.@each.weightGrams'),

  weightOz: function() {
    var weightOz = this.get('brew.positiveHopAdditions').reduce(function(accum, addition) {
      return accum + parseFloat(addition.get('weightOz'));
    }, 0);
    return weightOz;
  }.property('brew.positiveHopAdditions.@each.weightOz'),

  actions: {
    remove (model) {
      this.sendAction('remove', model);
    }
  }
});
