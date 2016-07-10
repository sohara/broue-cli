import Ember from 'ember';
import WeightConversionMixin from '../../mixins/weight-conversion-mixin';

export default Ember.Controller.extend(WeightConversionMixin, {
  needs: ['fermentables', 'application'],

  measureSystem: Ember.computed.alias('controllers.application.measureSystem'),

  fermentables: function() {
    return this.get('controllers.fermentables');
  }.property('controllers.fermentables'),

  conversions: {
    weightLbs: {
      factor: 16,
      property: 'weightOz'
    },
    weightKg: {
      factor: 1000,
      property: 'weightGrams'
    }
  },

  weightConversion: function(key, value) {
    var convertedProperty = this.conversions[key]['property'];
    var conversionFactor = this.conversions[key]['factor'];
    if (typeof(value) !== 'undefined') {
      var converted = parseFloat(value) * conversionFactor;
      this.set(`model.${convertedProperty}`, converted);
      return value;
    }
    if (isNaN(parseFloat(this.get(`model.${convertedProperty}`)))) {
      return undefined;
    } else {
      return this.get(`model.${convertedProperty}`) / conversionFactor;
    }
  },

  weightLbs: function(key, value) {
    return this.weightConversion(key, value);
  }.property('model.weightOz'),

  weightKg: function(key, value) {
    return this.weightConversion(key, value);
  }.property('weightGrams'),


  roundedToTwo: function(value) {
    return Math.round((value) * 100) / 100;
  }

});
