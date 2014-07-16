import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['styles'],

  styles: function() {
    return this.get('controllers.styles');
  }.property('controllers.styles'),

  volumeChanged: function(object, keyName) {
    console.log("Volume change fired");
    Ember.run.once(this, 'synchronizeUnits', keyName);
  }.observes('batchSizeLitres', 'batchSizeGallons', 'boilLossLitres', 'boilLossGallons'),

  mashRatioChanged: function(object, keyName) {
    console.log("Ratio change fired");
    Ember.run.once(this, 'synchronizeRatio', keyName);
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
      if (keyName == 'waterGrainRatioMetric') {
        var convertedUs = ratioMetric * 0.47930570952469;
        if (this.roundedToTwo(ratioUs) !== this.roundedToTwo(convertedUs)) {
          this.set('waterGrainRatioUs', convertedUs);
        }
      }
      else if (keyName == 'waterGrainRatioUs') {
        var convertedMetric = ratioUs / 0.47930570952469;
        if (this.roundedToTwo(ratioMetric) !== this.roundedToTwo(convertedMetric)) {
          debugger;
          this.set('waterGrainRatioMetric', convertedMetric);
        }
      }
    }
  },
  roundedToTwo: function(value) {
    return Math.round((value + 0.00001) * 100) / 100;
  }
});
