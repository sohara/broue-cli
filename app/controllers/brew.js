import Ember from 'ember';
const { computed, inject } = Ember;
const { alias } = computed;

export default Ember.Controller.extend({
  applicationController: inject.controller('application'),
  measureSystem: alias('applicationController.measureSystem'),
  currentUser: alias('applicationController.user'),

  recordedPostBoilVolumePresent: function() {
    return (!Ember.isBlank('recordedPostBoilVolumeLitres') || !Ember.isBlank('recordedPostBoilVolumeGallons'));
  }.property('recordedPostBoilVolumeLitres', 'recordedPostBoilVolumeGallons'),


  canEdit: function() {
    return this.get('currentUser.id') === this.get('model.user.id');
  }.property('currentUser.id', 'model.user.id'),

  strikeWaterVolume: function() {
    var measureSystemSuffix = this.get('measureSystem').capitalize();
    return this.get('model.strikeWaterVolume%@1'.fmt(measureSystemSuffix));
  }.property('model.strikeWaterVolumeMetric', 'model.strikeWaterVolumeUs', 'measureSystem'),

  unitOfMesure: function() {
    return this.get('measureSystem') === 'metric' ? 'litres' : 'gallons';
  }.property('measureSystem'),

  tempUnit: function() {
    return this.get('measureSystem') === 'metric' ? '°C' : '°F';
  }.property('measureSystem'),

  strikeWaterTemp: function() {
    var suffix = this.get('measureSystem') === 'metric' ? 'C' : 'F';
    return this.get('strikeWaterTemp' + suffix);
  }.property('measureSystem', 'strikeWaterTempC', 'strikeWaterTempF'),

  strikeWaterTempF: function() {
    return  Math.round(( (this.get('strikeWaterTempC') * (9/5)) + 32) * 100 ) / 100;
  }.property('strikeWaterTempC'),

  strikeWaterTempC: function() {
    var waterGrainRatioMetric = parseFloat(this.get('model.waterGrainRatioMetric'));
    var grainTemp = parseFloat(this.get('model.grainTempC'));
    var targetMashTemp = parseFloat(this.get('model.targetMashTempC'));
    var strikeTemp = ((0.2 / (waterGrainRatioMetric / 2)) * (targetMashTemp - grainTemp)) + targetMashTemp;
    return Math.round(strikeTemp * 100) / 100;
  }.property("model.waterGrainRatioMetric", "model.targetMashTempC", "model.grainTempC"),

  apparentAttenuation: function() {
    var recordedOriginalGravity = this.get('model.recordedOriginalGravity');
    var recordedFinalGravity = this.get('model.recordedFinalGravity');
    if (!Ember.isBlank(recordedOriginalGravity) && !Ember.isBlank(recordedFinalGravity)) {
      var aa = (recordedOriginalGravity - recordedFinalGravity) / (recordedOriginalGravity - 1);
      return (aa * 100).toFixed(1);
    } else {
      return "N/A";
    }
  }.property("model.recordedOriginalGravity", "model.recordedFinalGravity"),

  alcoholByVolume: function() {
    var recordedOriginalGravity = this.get('model.recordedOriginalGravity');
    var recordedFinalGravity = this.get('model.recordedFinalGravity');
    if (!Ember.isBlank(recordedOriginalGravity) && !Ember.isBlank(recordedFinalGravity)) {
      var abv = ((1.05 * (recordedOriginalGravity - recordedFinalGravity) / recordedFinalGravity) / 0.79);
      return (abv * 100).toFixed(1);
    } else {
      return "N/A";
    }
  }.property("model.recordedOriginalGravity", "model.recordedFinalGravity")
});
