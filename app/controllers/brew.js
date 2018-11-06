import { isBlank } from '@ember/utils';
import Controller, { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Controller.extend({
  applicationController: controller('application'),
  measureSystem: alias('applicationController.measureSystem'),
  currentUser: alias('applicationController.user'),

  recordedPostBoilVolumePresent: computed('recordedPostBoilVolumeLitres', 'recordedPostBoilVolumeGallons', function() {
    return !isBlank('recordedPostBoilVolumeLitres') || !isBlank('recordedPostBoilVolumeGallons');
  }),


  canEdit: computed('currentUser.id', 'model.user.id', function() {
    return this.get('currentUser.id') === this.get('model.user.id');
  }),

  strikeWaterVolume: computed('model.{strikeWaterVolumeMetric,strikeWaterVolumeUs}', 'measureSystem', function() {
    var measureSystemSuffix = this.get('measureSystem').capitalize();
    return this.get(`model.strikeWaterVolume${measureSystemSuffix}`);
  }),

  unitOfMesure: computed('measureSystem', function() {
    return this.get('measureSystem') === 'metric' ? 'litres' : 'gallons';
  }),

  tempUnit: computed('measureSystem', function() {
    return this.get('measureSystem') === 'metric' ? '°C' : '°F';
  }),

  strikeWaterTemp: computed('measureSystem', 'strikeWaterTempC', 'strikeWaterTempF', function() {
    var suffix = this.get('measureSystem') === 'metric' ? 'C' : 'F';
    return this.get('strikeWaterTemp' + suffix);
  }),

  strikeWaterTempF: computed('strikeWaterTempC', function() {
    return  Math.round(( (this.get('strikeWaterTempC') * (9/5)) + 32) * 100 ) / 100;
  }),

  strikeWaterTempC: computed('model.{waterGrainRatioMetric,targetMashTempC,grainTempC}', function() {
    var waterGrainRatioMetric = parseFloat(this.get('model.waterGrainRatioMetric'));
    var grainTemp = parseFloat(this.get('model.grainTempC'));
    var targetMashTemp = parseFloat(this.get('model.targetMashTempC'));
    var strikeTemp = ((0.2 / (waterGrainRatioMetric / 2)) * (targetMashTemp - grainTemp)) + targetMashTemp;
    return Math.round(strikeTemp * 100) / 100;
  }),

  apparentAttenuation: computed('model.{recordedOriginalGravity,recordedFinalGravity}', function() {
    var recordedOriginalGravity = this.get('model.recordedOriginalGravity');
    var recordedFinalGravity = this.get('model.recordedFinalGravity');
    if (!isBlank(recordedOriginalGravity) && !isBlank(recordedFinalGravity)) {
      var aa = (recordedOriginalGravity - recordedFinalGravity) / (recordedOriginalGravity - 1);
      return (aa * 100).toFixed(1);
    } else {
      return "N/A";
    }
  }),

  alcoholByVolume: computed('model.{recordedOriginalGravity,recordedFinalGravity}', function() {
    var recordedOriginalGravity = this.get('model.recordedOriginalGravity');
    var recordedFinalGravity = this.get('model.recordedFinalGravity');
    if (!isBlank(recordedOriginalGravity) && !isBlank(recordedFinalGravity)) {
      var abv = ((1.05 * (recordedOriginalGravity - recordedFinalGravity) / recordedFinalGravity) / 0.79);
      return (abv * 100).toFixed(1);
    } else {
      return "N/A";
    }
  }),

  actions: {
    destroyRecord: function(model) {
      var _this = this;
      var modelName = model.get('constructor.modelName').decamelize().replace("_", " ");
      if (confirm(`Are you sure you want to delete this ${modelName}?`)) {
        model.destroyRecord().then(function() {
          _this.flash.render(`${modelName.capitalize()} successfully destroyed`);
        });
      }
    }
  }
});
