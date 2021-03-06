import Component from '@ember/component';
import { computed, get } from '@ember/object';

const UNITS = {
  metric: {
    base: 'g',
    high: 'kg'
  },
  us: {
    base: 'oz',
    high: 'lbs'
  }
};

export default Component.extend({
  magnitude: 'base',

  localizedUnit: computed('measureSystem', function() {
    return this.measureSystem === 'metric' ? 'Grams' : 'Oz';
  }),

  localizedWeight: computed('model.{weightGrams,weightOz}', 'localizedUnit', function() {
    let localizedUnit = this.localizedUnit;
    return this.get(`model.weight${localizedUnit}`);
  }),

  localizedDivisor: computed('measureSystem', function() {
    return this.measureSystem === 'metric' ? 1000 : 16;
  }),

  displayWeight: computed('localizedWeight', 'magnitude', function() {
    var divisor = this.magnitude === 'high' ? this.localizedDivisor : 1;
    return this.roundedToTwo(this.localizedWeight / divisor);
  }),

  displayUnit: computed('measureSystem', 'magnitude', function() {
    let measureSystem = this.measureSystem;
    let magnitude = this.magnitude;
    return get(UNITS, `${measureSystem}.${magnitude}`);
  }),

  roundedToTwo: function(value) {
    return Math.round((value) * 100) / 100;
  }

});
