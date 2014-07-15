import Ember from 'ember';

export default Ember.Component.extend({
  magnitude: 'base',

  units: {
    metric: {
      base: 'g',
      high: 'kg'
    },
    us: {
      base: 'oz',
      high: 'lbs'
    }
  },

  localizedUnit: function() {
    return this.get('measureSystem') === 'metric' ? 'Grams' : 'Oz';
  }.property('measureSystem'),

  localizedWeight: function() {
    return this.get('model.weight%@1'.fmt(this.get('localizedUnit')));
  }.property('model.weightGrams', 'model.weightOz', 'measureSystem'),

  localizedDivisor: function() {
    return this.get('measureSystem') === 'metric' ? 1000 : 16
  }.property('measureSystem'),

  displayWeight: function() {
    var divisor = this.get('magnitude') == 'high' ? this.get('localizedDivisor') : 1;
    return this.roundedToTwo(this.get('localizedWeight') / divisor);
  }.property('localizedWeight', 'magnitude'),

  displayUnit: function() {
    return this.get('units.%@1.%@2'.fmt(this.get('measureSystem'), this.get('magnitude')));
  }.property('measureSystem', 'magnitude'),

  roundedToTwo: function(value) {
    return Math.round((value) * 100) / 100;
  }

});
