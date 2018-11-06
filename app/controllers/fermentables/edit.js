import Controller, { inject as controller } from '@ember/controller';
import { oneWay, alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import WeightConversionMixin from '../../mixins/weight-conversion-mixin';

const CONVERSIONS = {
  weightLbs: {
    factor: 16,
    property: 'weightOz'
  },
  weightKg: {
    factor: 1000,
    property: 'weightGrams'
  }
};

export default Controller.extend(WeightConversionMixin, {
  applicationController: controller('application'),
  fermentablesController: controller('fermentables'),

  measureSystem: alias('applicationController.measureSystem'),

  fermentables: oneWay('fermentablesController.model'),

  weightConversion: function(key, value) {
    var convertedProperty = CONVERSIONS[key]['property'];
    var conversionFactor = CONVERSIONS[key]['factor'];
    if (typeof(value) !== 'undefined') {
      var converted = parseFloat(value) * conversionFactor;
      this.set(`model.${convertedProperty}`, converted);
      return value;
    }
    if (isNaN(parseFloat(this.get(`model.${convertedProperty}`)))) {
      return undefined;
    } else {
      let converted = this.get(`model.${convertedProperty}`) / conversionFactor;
      return this.roundedToTwo(converted);
    }
  },

  weightLbs: computed('model.weightOz', {
    get (key) {
      return this.weightConversion(key);
    },
    set (key, value) {
      return this.weightConversion(key, value);
    }
  }),

  weightKg: computed('model.weightGrams', {
    get(key) {
      return this.weightConversion(key);
    },
    set (key, value) {
      return this.weightConversion(key, value);
    }
  })

});
