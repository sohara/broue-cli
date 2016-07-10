import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['fermentableAdditions', 'hopAdditions', 'application'],
  measureSystem: Ember.computed.alias('controllers.application.measureSystem'),

  totalMashedExtractUnits: Ember.computed.alias('controllers.fermentableAdditions.totalMashedExtractUnits'),
  totalUnmashedExtractUnits: Ember.computed.alias('controllers.fermentableAdditions.totalUnmashedExtractUnits'),
  maltColorUnits: Ember.computed.alias('controllers.fermentableAdditions.maltColorUnits'),
  totalIBUs: Ember.computed.alias('controllers.hopAdditions.totalIBUs'),
  totalMashedAdditionsWeightGrams: Ember.computed.alias('controllers.fermentableAdditions.totalMashedAdditionsWeightGrams'),
  totalExtractUnits: Ember.computed.alias('controllers.fermentableAdditions.totalExtractUnits'),

  recordedPostBoilVolumePresent: function() {
    return (!Ember.isBlank('recordedPostBoilVolumeLitres') || !Ember.isBlank('recordedPostBoilVolumeGallons'));
  }.property('recordedPostBoilVolumeLitres', 'recordedPostBoilVolumeGallons'),

  currentUser: Ember.computed.alias('controllers.application.user'),

  canEdit: function() {
    return this.get('currentUser.id') === this.get('model.user.id');
  }.property('currentUser.id', 'model.user.id'),

  originalGravity: function() {
    var totalMashedExtractUnits = this.get("totalMashedExtractUnits");
    var totalUnmashedExtractUnits = this.get("totalUnmashedExtractUnits");
    var efficiency = this.get("model.efficiency");
    var batchSizeLitres = this.get("model.batchSizeLitres");
    var mashed = ((totalMashedExtractUnits * 0.3865 * (efficiency / 100)) / batchSizeLitres);
    var unmashed = ((totalUnmashedExtractUnits * 0.3865) / batchSizeLitres);
    var og = 1 + mashed + unmashed;
    return og.toFixed(3);
  }.property("model.efficiency", "model.batchSizeLitres", "totalMashedExtractUnits", "totalUnmashedExtractUnits"),

  boilVolume: function() {
    var boilVolume = parseFloat(this.get("model.batchSizeLitres")) + parseFloat(this.get("model.boilLossLitres"));
    return Math.round(boilVolume * 100) / 100;
  }.property("model.batchSizeLitres", "model.boilLossLitres"),

  preBoilGravity: function() {
    var totalMashedExtractUnits = this.get("totalMashedExtractUnits");
    var totalUnmashedExtractUnits = this.get("totalUnmashedExtractUnits");
    var efficiency = this.get("model.efficiency");
    var boilVolume = this.get("boilVolume");
    var mashed = ((totalMashedExtractUnits * 0.3865 * (efficiency / 100)) / boilVolume);
    var unmashed = ((totalUnmashedExtractUnits * 0.3865) / boilVolume);
    var og = 1 + mashed + unmashed;
    return og.toFixed(3);
  }.property("model.efficiency", "totalMashedExtractUnits", "boilVolume", "totalUnmashedExtractUnits"),

  colorSRM: function() {
    var batchSizeGallons = this.get("model.batchSizeGallons");
    var maltColorUnits = this.get("maltColorUnits");
    var colorDensity = Math.round((maltColorUnits / batchSizeGallons) * 10000) / 10000;
    return Math.round(1.49 * (Math.pow(colorDensity, 0.69)) * 100) / 100;
  }.property("maltColorUnits", "model.batchSizeGallons"),

  gravityFactor: function() {
    var preBoilGravity = this.get("preBoilGravity");
    return (1.65 * (Math.pow(0.000125, preBoilGravity - 1)));
  }.property("preBoilGravity"),

  strikeWaterVolume: function() {
    var measureSystemSuffix = this.get('measureSystem').capitalize();
    return this.get('strikeWaterVolume%@1'.fmt(measureSystemSuffix));
  }.property('strikeWaterVolumeMetric', 'measureSystem'),

  strikeWaterVolumeMetric: function() {
    var totalMashedAdditionsWeightGrams = this.get('totalMashedAdditionsWeightGrams');
    var waterGrainRatioMetric = this.get('model.waterGrainRatioMetric');
    return (totalMashedAdditionsWeightGrams * waterGrainRatioMetric) / 1000;
  }.property("totalMashedAdditionsWeightGrams", "model.waterGrainRatioMetric"),

  strikeWaterVolumeUs: function() {
    return ( this.get('strikeWaterVolumeMetric') / 3.7854118 ).toFixed(2);
  }.property('strikeWaterVolumeMetric'),

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

  recordedEfficiency: function() {
    var recordedOriginalGravity = this.get('model.recordedOriginalGravity');
    if (typeof(recordedOriginalGravity) !== "undefined") {
      var totalExtractUnits = this.get('totalExtractUnits');
      var batchSize = this.get("model.batchSizeLitres");
      var recordedPostBoilVolume = this.get("model.recordedPostBoilVolumeLitres");
      var volume = recordedPostBoilVolume > 0 ? recordedPostBoilVolume : batchSize;
      var maximumOG = ((totalExtractUnits * 0.3865) / volume);
      var efficiency = ((recordedOriginalGravity - 1) / maximumOG) * 100;
      return efficiency.toFixed(1);
    }
    else {
      return "N/A";
    }
  }.property("totalExtractUnits", "model.recordedOriginalGravity", "model.batchSizeLitres", "model.recordedPostBoilVolumeLitres"),

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
