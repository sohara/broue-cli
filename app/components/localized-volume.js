import Ember from 'ember';

export default Ember.Component.extend({
  property: null,
  propertyName: null,

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

  propertyDidChange: function() {
    Ember.run.once(this, function() {
      if ( this.get('property') !== null ) {
        var propertyName =  '%@1%@2'.fmt(this.get('property'), this.get('localizedUnit'));
        this.set('propertyName', propertyName);
      }
    });
  }.observes('property', 'localizedUnit').on('init'),

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
      var propertyName = this.get('propertyName');
      return this.roundedToTwo(this.get('model.%@1'.fmt(propertyName)));
    }
  }.property('propertyName', 'model', 'localizedUnit'),

  displayUnit: function() {
    if (this.get('property') === 'waterGrainRatio') {
      return this.get('units.ratio.%@1'.fmt(this.get('measureSystem')));
    } else if (this.get('property').indexOf('Temp') > -1) {
      return this.get('units.temp.%@1'.fmt(this.get('measureSystem')));
    } else {
      return this.get('units.volume.%@1'.fmt(this.get('measureSystem')));
    }
  }.property('measureSystem'),

  roundedToTwo: function(value) {
    return Math.round((value) * 100) / 100;
  }

});
