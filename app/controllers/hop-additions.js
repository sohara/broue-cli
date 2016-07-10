import Ember from 'ember';

export default Ember.ArrayController.extend({
  itemController: 'hopAddition',

  needs: ['brew', 'application'],
  measureSystem: Ember.computed.alias('controllers.application.measureSystem'),

  canEdit: Ember.computed.alias('controllers.brew.canEdit'),

  // Positive additions are those whose weight is greater
  // than zero, and can therefore be included in calculations
  // (filtering to avoid NaN results)
  positive: Ember.computed.filter('@this.@each.model.weightGrams', function(addition) {
    return addition.get('model.weightGrams') > 0;
  }),

  totalIBUs: function() {
    var totalIBUs = this.get('positive').reduce(function(accum, addition) {
      return accum + addition.get('ibus');
    }, 0);
    return Math.round(totalIBUs * 10) / 10;
  }.property('positive.@each.ibus'),

  weightGrams: function() {
    var weightGrams = this.get('positive').reduce(function(accum, addition) {
      return accum + parseFloat(addition.get('model.weightGrams'));
    }, 0);
    return weightGrams;
  }.property('positive.@each.model.weightGrams'),

  weightOz: function() {
    var weightOz = this.get('positive').reduce(function(accum, addition) {
      return accum + parseFloat(addition.get('model.weightOz'));
    }, 0);
    return weightOz;
  }.property('@each.model.weightOz'),
});
