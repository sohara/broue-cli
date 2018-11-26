import Controller, { inject as controller } from '@ember/controller';
import { oneWay, alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import convertedUnits from 'broue/lib/converted-units';

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

export default Controller.extend({
  applicationController: controller('application'),
  fermentablesController: controller('fermentables'),
  measureSystem: alias('applicationController.measureSystem'),
  fermentables: oneWay('fermentablesController.model'),
  weightOz: convertedUnits('weight', 'weight', 'US'),
  weightGrams: convertedUnits('weight', 'weight', 'Metric'),

  weightConversion: function(key, value) {
    var convertedProperty = CONVERSIONS[key]['property'];
    var conversionFactor = CONVERSIONS[key]['factor'];
    if (typeof(value) !== 'undefined') {
      var converted = parseFloat(value) * conversionFactor;
      this.set(convertedProperty, converted);
      return value;
    }
    if (isNaN(parseFloat(this.get(convertedProperty)))) {
      return undefined;
    } else {
      let converted = this.get(convertedProperty) / conversionFactor;
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
  }),

  roundedToTwo: function(value) {
    return Math.round((value + 0.00001) * 100) / 100;
  },

  actions: {
    close() {
      this.send('closeModal');
    },
    saveModel(model) {
      this.send('save', model);
    }
  }

});
