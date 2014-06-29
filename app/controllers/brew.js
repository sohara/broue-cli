import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['fermentableAdditions', 'hopAdditions'],

  fermentableAdditions: Ember.computed.alias('computed.fermentableAdditions'),
  totalMashedExtractUnits: Ember.computed.alias('controllers.fermentableAdditions.totalMashedExtractUnits'),
  totalUnmashedExtractUnits: Ember.computed.alias('controllers.fermentableAdditions.totalUnmashedExtractUnits'),
  maltColorUnits: Ember.computed.alias('controllers.fermentableAdditions.maltColorUnits'),
  totalIBUs: Ember.computed.alias('controllers.hopAdditions.totalIBUs'),
  totalMashedAdditionsWeight: Ember.computed.alias('controllers.fermentableAdditions.totalMashedAdditionsWeight'),
  totalExtractUnits: Ember.computed.alias('controllers.fermentableAdditions.totalExtractUnits'),

  originalGravity: function() {
    var totalMashedExtractUnits = this.get("totalMashedExtractUnits");
    var totalUnmashedExtractUnits = this.get("totalUnmashedExtractUnits");
    var efficiency = this.get("efficiency");
    var batchSize = this.get("batchSize");
    var mashed = ((totalMashedExtractUnits * 0.3865 * (efficiency / 100)) / batchSize);
    var unmashed = ((totalUnmashedExtractUnits * 0.3865) / batchSize);
    var og = 1 + mashed + unmashed;
    return og.toFixed(3);
  }.property("efficiency", "batchSize", "totalMashedExtractUnits", "totalUnmashedExtractUnits"),

  boilVolume: function() {
    var boilVolume = parseFloat(this.get("batchSize")) + parseFloat(this.get("boilLoss"));
    return Math.round(boilVolume * 100) / 100;
  }.property("batchSize"),

  preBoilGravity: function() {
    var totalMashedExtractUnits = this.get("totalMashedExtractUnits");
    var totalUnmashedExtractUnits = this.get("totalUnmashedExtractUnits");
    var efficiency = this.get("efficiency");
    var boilVolume = this.get("boilVolume");
    var mashed = ((totalMashedExtractUnits * 0.3865 * (efficiency / 100)) / boilVolume);
    var unmashed = ((totalUnmashedExtractUnits * 0.3865) / boilVolume);
    var og = 1 + mashed + unmashed;
    return og.toFixed(3);
  }.property("efficiency", "batchSize", "totalMashedExtractUnits", "boilVolume", "totalUnmashedExtractUnits"),

  colorSRM: function() {
    var batchSizeGallons = this.get("batchSize") * 0.26417205;
    var maltColorUnits = this.get("maltColorUnits");
    var colorDensity = Math.round((maltColorUnits / batchSizeGallons) * 10000) / 10000;
    return Math.round(1.49 * (Math.pow(colorDensity, 0.69)) * 100) / 100
  }.property("maltColorUnits", "batchSize"),

  gravityFactor: function() {
    var preBoilGravity = this.get("preBoilGravity");
    return (1.65 * (Math.pow(0.000125, preBoilGravity - 1)));
  }.property("preBoilGravity"),

  strikeWaterVolume: function() {
    var totalMashedAdditionsWeight = this.get('totalMashedAdditionsWeight');
    var waterGrainRatio = this.get('waterGrainRatio');
    return (totalMashedAdditionsWeight * waterGrainRatio) / 1000;
  }.property("totalMashedAdditionsWeight", "waterGrainRatio"),

  strikeWaterTemp: function() {
    var waterGrainRatio = parseFloat(this.get('waterGrainRatio'));
    var grainTemp = parseFloat(this.get('grainTemp'));
    var targetMashTemp = parseFloat(this.get('targetMashTemp'));
    var strikeTemp = ((0.2 / (waterGrainRatio / 2)) * (targetMashTemp - grainTemp)) + targetMashTemp;
    return Math.round(strikeTemp * 100) / 100;
  }.property("waterGrainRatio", "targetMashTemp", "grainTemp"),

  recordedEfficiency: function() {
    var recordedOriginalGravity = this.get('recordedOriginalGravity');
    if (typeof(recordedOriginalGravity) != "undefined") {
      var totalExtractUnits = this.get('totalExtractUnits');
      var batchSize = this.get("batchSize");
      var recordedPostBoilVolume = this.get("recordedPostBoilVolume");
      var volume = recordedPostBoilVolume > 0 ? recordedPostBoilVolume : batchSize;
      var maximumOG = ((totalExtractUnits * 0.3865) / volume);
      var efficiency = ((recordedOriginalGravity - 1) / maximumOG) * 100;
      return efficiency.toFixed(1);
    }
    else {
      return "N/A";
    }
  }.property("totalExtractUnits", "recordedOriginalGravity", "batchSize", "recordedPostBoilVolume"),

  apparentAttenuation: function() {
    var recordedOriginalGravity = this.get('recordedOriginalGravity');
    var recordedFinalGravity = this.get('recordedFinalGravity');
    if (!Ember.isBlank(recordedOriginalGravity) && !Ember.isBlank(recordedFinalGravity)) {
      var aa = (recordedOriginalGravity - recordedFinalGravity) / (recordedOriginalGravity - 1);
      return (aa * 100).toFixed(1);
    } else {
      return "N/A";
    }
  }.property("recordedOriginalGravity", "recordedFinalGravity"),


  alcoholByVolume: function() {
    var recordedOriginalGravity = this.get('recordedOriginalGravity');
    var recordedFinalGravity = this.get('recordedFinalGravity')
    if (!Ember.isBlank(recordedOriginalGravity) && !Ember.isBlank(recordedFinalGravity)) {
      var abv = ((1.05 * (recordedOriginalGravity - recordedFinalGravity) / recordedFinalGravity) / 0.79);
      return (abv * 100).toFixed(1);
    } else {
      return "N/A";
    }
  }.property("recordedOriginalGravity", "recordedFinalGravity").cacheable()
});
