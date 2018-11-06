import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  property: null,

  units: {
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
  },

  propertyName: computed('property', 'localizedUnit', function () {
    let property = this.get('property');
    let localizedUnit = this.get('localizedUnit');
    return property + localizedUnit;
  }),

  localizedUnit: function() {
    if (this.get('property') === 'waterGrainRatio') {
      return this.get('measureSystem') === 'metric' ? 'Metric' : 'Us';
    } else if (this.get('property').indexOf('Temp') > -1) {
      return this.get('measureSystem') === 'metric' ? 'C' : 'F';
    } else {
      return this.get('measureSystem') === 'metric' ? 'Litres' : 'Gallons';
    }
  }.property('measureSystem', 'property'),

  displayVolume: function() {
    if ( this.get('propertyName') !== null ) {
      let propertyName = this.get('propertyName');
      return this.roundedToTwo(this.get(`model.${propertyName}`));
    }
  }.property('propertyName', 'model', 'localizedUnit'),

  displayUnit: function() {
    let measureSystem = this.get('measureSystem');
    if (this.get('property') === 'waterGrainRatio') {
      return this.get(`units.ratio.${measureSystem}`);
    } else if (this.get('property').indexOf('Temp') > -1) {
      return this.get(`units.temp.${measureSystem}`);
    } else {
      return this.get(`units.volume.${measureSystem}`);
    }
  }.property('measureSystem'),

  roundedToTwo: function(value) {
    return Math.round((value) * 100) / 100;
  }

});
