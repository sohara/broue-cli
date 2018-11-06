import Component from '@ember/component';
import { computed, get } from '@ember/object';

const UNITS = {
  volume: {
    metric: 'litres',
    us: 'gallons'
  },
  ratio: {
    metric: 'litres/kg',
    us: 'quarts/lb'
  },
  temp: {
    metric: '°C',
    us: '°F'
  }
};

export default Component.extend({
  property: null,

  propertyName: computed('property', 'localizedUnit', function () {
    let property = this.get('property');
    let localizedUnit = this.get('localizedUnit');
    return property + localizedUnit;
  }),

  localizedUnit: computed('measureSystem', 'property', function() {
    if (this.get('property') === 'waterGrainRatio') {
      return this.get('measureSystem') === 'metric' ? 'Metric' : 'Us';
    } else if (this.get('property').indexOf('Temp') > -1) {
      return this.get('measureSystem') === 'metric' ? 'C' : 'F';
    } else {
      return this.get('measureSystem') === 'metric' ? 'Litres' : 'Gallons';
    }
  }),

  displayVolume: computed('propertyName', 'model', 'localizedUnit', function() {
    if ( this.get('propertyName') !== null ) {
      let propertyName = this.get('propertyName');
      return this.roundedToTwo(this.get(`model.${propertyName}`));
    }
  }),

  displayUnit: computed('measureSystem', function() {
    let measureSystem = this.get('measureSystem');
    if (this.get('property') === 'waterGrainRatio') {
      return get(UNITS, `ratio.${measureSystem}`);
    } else if (this.get('property').indexOf('Temp') > -1) {
      return get(UNITS, `temp.${measureSystem}`);
    } else {
      return get(UNITS, `volume.${measureSystem}`);
    }
  }),

  roundedToTwo: function(value) {
    return Math.round((value) * 100) / 100;
  }

});
