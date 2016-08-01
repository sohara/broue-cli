import DS from 'ember-data';
import Ember from 'ember';
const { computed } = Ember;


export default DS.Model.extend({
  name: DS.attr('string'),
  batchSizeLitres: DS.attr('number'),
  batchSizeGallons: DS.attr('number'),
  boilLossLitres: DS.attr('number'),
  boilLossGallons: DS.attr('number'),
  efficiency: DS.attr('number', { defaultValue: 75 }),
  grainTempC: DS.attr('number'),
  grainTempF: DS.attr('number'),
  brewDate: DS.attr('string'),
  targetMashTempC: DS.attr('number'),
  targetMashTempF: DS.attr('number'),
  waterGrainRatioMetric: DS.attr('number', { defaultValue: 3 }),
  waterGrainRatioUs: DS.attr('number', { defaultValue: 1.5 }),
  recordedOriginalGravity: DS.attr('number'),
  recordedFinalGravity: DS.attr('number'),
  recordedPostBoilVolumeLitres: DS.attr('number'),
  recordedPostBoilVolumeGallons: DS.attr('number'),
  createdAt: DS.attr('date'),
  style: DS.belongsTo('Style', {async: true}),
  fermentableAdditions: DS.hasMany('FermentableAddition', {async: true}),
  hopAdditions: DS.hasMany('HopAddition', {async: true}),
  yeastAdditions: DS.hasMany('YeastAddition', {async: true}),
  notes: DS.hasMany('Note', {async: true}),
  user: DS.belongsTo('user', {async: true}),

  recordedEfficiency: function() {
    var recordedOriginalGravity = this.get('recordedOriginalGravity');
    if (typeof(recordedOriginalGravity) !== "undefined") {
      var totalExtractUnits = this.get('totalExtractUnits');
      var batchSize = this.get("batchSizeLitres");
      var recordedPostBoilVolume = this.get("recordedPostBoilVolumeLitres");
      var volume = recordedPostBoilVolume > 0 ? recordedPostBoilVolume : batchSize;
      var maximumOG = ((totalExtractUnits * 0.3865) / volume);
      var efficiency = ((recordedOriginalGravity - 1) / maximumOG) * 100;
      return efficiency.toFixed(1);
    }
    else {
      return "N/A";
    }
  }.property("totalExtractUnits", "recordedOriginalGravity", "batchSizeLitres", "recordedPostBoilVolumeLitres"),
  colorSRM: function() {
    var batchSizeGallons = this.get("batchSizeGallons");
    var maltColorUnits = this.get("maltColorUnits");
    var colorDensity = Math.round((maltColorUnits / batchSizeGallons) * 10000) / 10000;
    return Math.round(1.49 * (Math.pow(colorDensity, 0.69)) * 100) / 100;
  }.property("maltColorUnits", "batchSizeGallons"),

  maltColorUnits: function() {
    return this.get('positiveFermentableAdditions').reduce(function(accum, addition) {
      var weightLbs = addition.get('weightGrams') * 0.0022046226;
      var additionUnits = weightLbs * addition.get('color');
      return accum + additionUnits;
    }, 0);
  }.property('positiveFermentableAdditions.@each.color', 'positiveFermentableAdditions.@each.weightGrams'),

  originalGravity: function() {
    var totalMashedExtractUnits = this.get("totalMashedExtractUnits");
    var totalUnmashedExtractUnits = this.get("totalUnmashedExtractUnits");
    var efficiency = this.get("efficiency");
    var batchSizeLitres = this.get("batchSizeLitres");
    var mashed = ((totalMashedExtractUnits * 0.3865 * (efficiency / 100)) / batchSizeLitres);
    var unmashed = ((totalUnmashedExtractUnits * 0.3865) / batchSizeLitres);
    var og = 1 + mashed + unmashed;
    return og.toFixed(3);
  }.property("efficiency", "batchSizeLitres", "totalMashedExtractUnits", "totalUnmashedExtractUnits"),

  gravityFactor: function() {
    var preBoilGravity = this.get("preBoilGravity");
    return (1.65 * (Math.pow(0.000125, preBoilGravity - 1)));
  }.property("preBoilGravity"),

  preBoilGravity: function() {
    var totalMashedExtractUnits = this.get("totalMashedExtractUnits");
    var totalUnmashedExtractUnits = this.get("totalUnmashedExtractUnits");
    var efficiency = this.get("efficiency");
    var boilVolume = this.get("boilVolume");
    var mashed = ((totalMashedExtractUnits * 0.3865 * (efficiency / 100)) / boilVolume);
    var unmashed = ((totalUnmashedExtractUnits * 0.3865) / boilVolume);
    var og = 1 + mashed + unmashed;
    return og.toFixed(3);
  }.property("efficiency", "totalMashedExtractUnits", "boilVolume", "totalUnmashedExtractUnits"),

  boilVolume: function() {
    var boilVolume = parseFloat(this.get("batchSizeLitres")) + parseFloat(this.get("boilLossLitres"));
    return Math.round(boilVolume * 100) / 100;
  }.property("batchSizeLitres", "boilLossLitres"),

  decoratedFermentableAdditions: computed('fermentableAdditions.[]', function () {
    const brew = this;
    const fermentableAdditionDecoratorModel = this.store.modelFor('fermentable-addition-decorator');
    return this.get('fermentableAdditions').map(addition => {
      return fermentableAdditionDecoratorModel.create({
        brew,
        content: addition,
      });
    });
  }),

  decoratedHopAdditions: computed('hopAdditions.[]', function () {
    const brew = this;
    const hopAdditionDecoratorModel = this.store.modelFor('hop-addition-decorator');
    return this.get('hopAdditions').map(addition => {
      return hopAdditionDecoratorModel.create({
        brew,
        content: addition,
      });
    });
  }),

  positiveFermentableAdditions: computed.filter('decoratedFermentableAdditions.@each.weightGrams', function(addition) {
    return addition.get('weightGrams') > 0;
  }),
  mashable: computed.filterBy('positiveFermentableAdditions', 'mashable', true),
  unmashable: computed.filterBy('positiveFermentableAdditions', 'mashable', false),

  positiveHopAdditions: computed.filter('decoratedHopAdditions.@each.weightGrams', function(addition) {
    return addition.get('weightGrams') > 0;
  }),

  strikeWaterVolumeMetric: function() {
    var totalMashedAdditionsWeightGrams = this.get('totalMashedAdditionsWeightGrams');
    var waterGrainRatioMetric = this.get('waterGrainRatioMetric');
    return (totalMashedAdditionsWeightGrams * waterGrainRatioMetric) / 1000;
  }.property("totalMashedAdditionsWeightGrams", "waterGrainRatioMetric"),

  strikeWaterVolumeUs: function() {
    return ( this.get('strikeWaterVolumeMetric') / 3.7854118 ).toFixed(2);
  }.property('strikeWaterVolumeMetric'),

  totalIBUs: function() {
    var totalIBUs = this.get('positiveHopAdditions').reduce(function(accum, addition) {
      return accum + addition.get('ibus');
    }, 0);
    return Math.round(totalIBUs * 10) / 10;
  }.property('positiveHopAdditions.@each.ibus'),

  totalMashedAdditionsWeightGrams: function() {
    var totalWeightGrams = this.get('mashable').reduce(function(accum, addition) {
      return accum + parseFloat(addition.get('weightGrams'));
    }, 0);
    return totalWeightGrams;
  }.property('mashable.@each.weightGrams'),

  totalMashedExtractUnits: function() {
    return this.get('mashable').reduce(function(accum, addition) {
      return accum + addition.get('extractUnits');
    }, 0);
  }.property('mashable.@each.extractUnits'),

  totalUnmashedExtractUnits: function() {
    return this.get('unmashable').reduce(function(accum, addition) {
      return accum + addition.get('extractUnits');
    }, 0);
  }.property('unmashable.@each.extractUnits'),

  totalExtractUnits: function() {
    var sum = this.get('totalMashedExtractUnits') + this.get('totalUnmashedExtractUnits');
    return Math.round(sum * 100) / 100;
  }.property('totalMashedExtractUnits', 'totalUnmashedExtractUnits'),
});
