import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['fermentableAdditions', 'hopAdditions'],

  fermentableAdditions: Ember.computed.alias('computed.fermentableAdditions'),
  totalMashedExtractUnits: Ember.computed.alias('controllers.fermentableAdditions.totalMashedExtractUnits'),
  totalUnmashedExtractUnits: Ember.computed.alias('controllers.fermentableAdditions.totalUnmashedExtractUnits'),
  maltColorUnits: Ember.computed.alias('controllers.fermentableAdditions.maltColorUnits'),
  totalIBUs: Ember.computed.alias('controllers.hopAdditions.totalIBUs'),
  totalMashedAdditionsWeight: Ember.computed.alias('controllers.fermentableAdditions.totalMashedAdditionsWeight'),

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
  }.property("waterGrainRatio", "targetMashTemp", "grainTemp")
});
