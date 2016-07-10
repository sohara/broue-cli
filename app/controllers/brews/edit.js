import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['styles', 'application'],
  measureSystem: Ember.computed.alias('controllers.application.measureSystem'),

  defaults: {
    us: {
      batchSizeGallons: 5,
      boilLossGallons: 1,
      grainTempF: 68,
      targetMashTempF: 150,
      waterGrainRatioUs: 1.5
    },
    metric: {
      batchSizeLitres: 20,
      boilLossLitres: 5,
      grainTempC: 20,
      targetMashTempC: 65,
      waterGrainRatioMetric: 3
    }
  },

  synchronizeAll: function() {
    if (this.get('content.isNew')) {
      var defaults = this.get('defaults.' + this.get('measureSystem'));
      this.setProperties(defaults);
    }
  }.observes('content', 'measureSystem'),

  styles: function() {
    return this.get('controllers.styles');
  }.property('controllers.styles'),

  volumeChanged: function(object, keyName) {
    this.synchronizeUnits(keyName);
  }.observes('batchSizeLitres', 'batchSizeGallons', 'boilLossLitres', 'boilLossGallons', 'recordedPostBoilVolumeLitres', 'recordedPostBoilVolumeGallons'),

  tempChanged: function(object, keyName) {
    this.synchronizeTemp(keyName);
  }.observes('targetMashTempC', 'targetMashTempF', 'grainTempC', 'grainTempF'),

  synchronizeTemp: function(keyName) {
    if (this.get('content') !== null) {
      var toStrip = keyName.charAt(keyName.length -1);
      var key = keyName.slice(0, keyName.length -1);
      var tempC = parseFloat(this.get(key + 'C')) || 0;
      var tempF = parseFloat(this.get(key + 'F')) || 0;
      if (toStrip === 'F') {
        var convertedC = ( tempF -32 ) * (5/9);
        if (this.roundedToTwo(tempC) !== this.roundedToTwo(convertedC)) {
          this.set(key + 'C', convertedC);
        }
      }
      else if (toStrip === 'C') {
        var convertedF = (tempC * (9/5)) + 32;
        if (this.roundedToTwo(tempF) !== this.roundedToTwo(convertedF)) {
          this.set(key + 'F', convertedF);
        }
      }
    }
  },

  mashRatioChanged: function(object, keyName) {
    this.synchronizeRatio(keyName);
  }.observes('waterGrainRatioMetric', 'waterGrainRatioUs'),

  synchronizeUnits: function(keyName) {
    if (this.get('content') !== null) {
      var toStrip = (keyName.indexOf('Gallons') > 1) ? 'Gallons' : 'Litres';
      var key = keyName.replace(toStrip, '');
      var volumeGallons = parseFloat(this.get(keyName)) || 0;
      var volumeLitres = parseFloat(this.get(key + 'Litres')) || 0;
      if (keyName.indexOf('Gallons') > -1) {
        var convertedLitres = volumeGallons * 3.7854118;
        if (this.roundedToTwo(volumeLitres) !== this.roundedToTwo(convertedLitres)) {
          this.set(key + 'Litres', convertedLitres);
        }
      }
      else if (keyName.indexOf('Litres') > -1) {
        var convertedGallons = volumeLitres / 3.7854118;
        if (this.roundedToTwo(volumeGallons) !== this.roundedToTwo(convertedGallons)) {
          this.set(key + 'Gallons', convertedGallons);
        }
      }
    }
  },

  synchronizeRatio: function(keyName) {
    if (this.get('content') !== null) {
      var ratioMetric = parseFloat(this.get('waterGrainRatioMetric')) || 0;
      var ratioUs = parseFloat(this.get('waterGrainRatioUs')) || 0;
      if (keyName === 'waterGrainRatioMetric') {
        var convertedUs = ratioMetric * 0.47930570952469;
        if (this.roundedToTwo(ratioUs) !== this.roundedToTwo(convertedUs)) {
          this.set('waterGrainRatioUs', convertedUs);
        }
      }
      else if (keyName === 'waterGrainRatioUs') {
        var convertedMetric = ratioUs / 0.47930570952469;
        if (this.roundedToTwo(ratioMetric) !== this.roundedToTwo(convertedMetric)) {
          this.set('waterGrainRatioMetric', convertedMetric);
        }
      }
    }
  },
  roundedToTwo: function(value) {
    return Math.round((value + 0.00001) * 100) / 100;
  }
});
