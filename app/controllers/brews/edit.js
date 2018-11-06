import Controller, { inject as controller } from '@ember/controller';
import { alias } from '@ember/object/computed';

export default Controller.extend({
  applicationController: controller('application'),
  stylesController: controller('styles'),
  measureSystem: alias('applicationController.measureSystem'),
  styles: alias('stylesController.model'),

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
    if (this.get('model.isNew')) {
      var defaults = this.get('defaults.' + this.get('measureSystem'));
      this.get('model').setProperties(defaults);
    }
  }.observes('model', 'measureSystem'),

  volumeChanged: function(object, keyName) {
    this.synchronizeUnits(keyName);
  }.observes('model.batchSizeLitres', 'model.batchSizeGallons', 'model.boilLossLitres', 'model.boilLossGallons', 'model.recordedPostBoilVolumeLitres', 'model.recordedPostBoilVolumeGallons').on('init'),

  tempChanged: function(object, keyName) {
    this.synchronizeTemp(keyName);
  }.observes('model.targetMashTempC', 'model.targetMashTempF', 'model.grainTempC', 'model.grainTempF'),

  synchronizeTemp: function(keyName) {
    if (this.get('model') !== null) {
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
  }.observes('model.waterGrainRatioMetric', 'model.waterGrainRatioUs'),

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
    if (this.get('model') !== null) {
      var ratioMetric = parseFloat(this.get('model.waterGrainRatioMetric')) || 0;
      var ratioUs = parseFloat(this.get('model.waterGrainRatioUs')) || 0;
      if (keyName === 'model.waterGrainRatioMetric') {
        var convertedUs = ratioMetric * 0.47930570952469;
        if (this.roundedToTwo(ratioUs) !== this.roundedToTwo(convertedUs)) {
          this.set('model.waterGrainRatioUs', convertedUs);
        }
      }
      else if (keyName === 'model.waterGrainRatioUs') {
        var convertedMetric = ratioUs / 0.47930570952469;
        if (this.roundedToTwo(ratioMetric) !== this.roundedToTwo(convertedMetric)) {
          this.set('model.waterGrainRatioMetric', convertedMetric);
        }
      }
    }
  },
  roundedToTwo: function(value) {
    return Math.round((value + 0.00001) * 100) / 100;
  }
});
