import Ember from 'ember';

export default Ember.ArrayController.extend({
  itemController: 'fermentableAddition',

  needs: ['brew', 'application'],
  measureSystem: Ember.computed.alias('controllers.application.measureSystem'),

  canEdit: Ember.computed.alias('controllers.brew.canEdit'),

  // Positive additions are those whose weight is greater
  // than zero, and can therefore be included in calculations
  // (filtering to avoid NaN results)
  positive: Ember.computed.filter('@this.@each.{model.weightGrams}', function(addition) {
    return addition.get('model.weightGrams') > 0;
  }),

  mashable: Ember.computed.filterBy('positive', 'mashable', true),
  unmashable: Ember.computed.filterBy('positive', 'mashable', false),

  totalMashedExtractUnits: function() {
    return this.get('mashable').reduce(function(accum, addition) {
      return accum + addition.get('extractUnits');
    }, 0);
  }.property('mashable.@each.extractUnits'),

  totalUnmashedExtractUnits: function() {
    return this.get('unmashable').reduce(function(accum, addition) {
      return accum + addition.get('extractUnits');
    }, 0);
  }.property('unmashable.@each.extractUnits'),

  totalExtractUnits: function() {
    var sum = this.get('totalMashedExtractUnits') + this.get('totalUnmashedExtractUnits');
    return Math.round(sum * 100) / 100;
  }.property('totalMashedExtractUnits', 'totalUnmashedExtractUnits'),

  weightGrams: function() {
    var weightGrams = this.get('positive').reduce(function(accum, addition) {
      return accum + parseFloat(addition.get('model.weightGrams'));
    }, 0);
    return weightGrams;
  }.property('@each.model.weightGrams'),

  weightOz: function() {
    var weightOz = this.get('positive').reduce(function(accum, addition) {
      return accum + parseFloat(addition.get('model.weightOz'));
    }, 0);
    return weightOz;
  }.property('@each.model.weightOz'),

  totalMashedAdditionsWeightGrams: function() {
    var totalWeightGrams = this.get('mashable').reduce(function(accum, addition) {
      return accum + parseFloat(addition.get('model.weightGrams'));
    }, 0);
    return totalWeightGrams;
  }.property('mashable.@each.model.weightGrams'),

  maltColorUnits: function() {
    return this.get('positive').reduce(function(accum, addition) {
      var weightLbs = addition.get('model.weightGrams') * 0.0022046226;
      var additionUnits = weightLbs * addition.get('color');
      return accum + additionUnits;
    }, 0);
  }.property('positive.@each.color', 'positive.@each.model.weightGrams')

});
