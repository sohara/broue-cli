import Component from '@ember/component';

export default Component.extend({
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
    let localizedUnit = this.get('localizedUnit');
    return this.get(`model.weight${localizedUnit}`);
  }.property('model.weightGrams', 'model.weightOz', 'localizedUnit'),

  localizedDivisor: function() {
    return this.get('measureSystem') === 'metric' ? 1000 : 16;
  }.property('measureSystem'),

  displayWeight: function() {
    var divisor = this.get('magnitude') === 'high' ? this.get('localizedDivisor') : 1;
    return this.roundedToTwo(this.get('localizedWeight') / divisor);
  }.property('localizedWeight', 'magnitude'),

  displayUnit: function() {
    let measureSystem = this.get('measureSystem');
    let magnitude = this.get('magnitude');
    return this.get(`units.${measureSystem}.${magnitude}`);
  }.property('measureSystem', 'magnitude'),

  roundedToTwo: function(value) {
    return Math.round((value) * 100) / 100;
  }

});
