import Ember from 'ember';

export default Ember.ArrayController.extend({
  itemController: 'hopAddition',

  // Positive additions are those whose weight is greater
  // than zero, and can therefore be included in calculations
  // (filtering to avoid NaN results)
  positive: Ember.computed.filter('@this.@each.weight', function(addition) {
    return addition.get('weight') > 0;
  }),

  totalIBUs: function() {
    var totalIBUs = this.get('positive').reduce(function(accum, addition) {
      return accum + addition.get('ibus');
    }, 0);
    return Math.round(totalIBUs * 10) / 10;
  }.property('positive.@each.ibus'),

  totalWeight: function() {
    var totalWeight = this.get('positive').reduce(function(accum, addition) {
      return accum + parseInt(addition.get('weight'));
    }, 0);
    return totalWeight;
  }.property('positive.@each.weight')
});
