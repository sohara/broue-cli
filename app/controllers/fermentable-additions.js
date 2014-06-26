import Ember from 'ember';

export default Ember.ArrayController.extend({
  itemController: 'fermentableAddition',

  // Positive additions are those whose weight is greater
  // than zero, and can therefore be included in calculations
  // (filtering to avoid NaN results)
  positive: Ember.computed.filter('@this', function(addition) {
    return addition.get('weight') > 0;
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

  maltColorUnits: function() {
    return this.get('positive').reduce(function(accum, addition) {
      var weightLbs = addition.get('weight') * 0.0022046226;
      var additionUnits = weightLbs * addition.get('color');
      return accum + additionUnits;
    }, 0);
  }.property('positive.@each.color', 'positive.@each.weight')

});
