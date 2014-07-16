import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  batchSizeLitres: DS.attr('number'),
  batchSizeGallons: DS.attr('number'),
  boilLossLitres: DS.attr('number'),
  boilLossGallons: DS.attr('number'),
  efficiency: DS.attr('number'),
  grainTemp: DS.attr('number'),
  brewDate: DS.attr('string'),
  targetMashTemp: DS.attr('number'),
  waterGrainRatioMetric: DS.attr('number'),
  waterGrainRatioUs: DS.attr('number'),
  recordedOriginalGravity: DS.attr('number'),
  recordedFinalGravity: DS.attr('number'),
  recordedPostBoilVolume: DS.attr('number'),
  createdAt: DS.attr('date'),
  style: DS.belongsTo('Style'),
  fermentableAdditions: DS.hasMany('FermentableAddition', {async: true}),
  hopAdditions: DS.hasMany('HopAddition', {async: true}),
  yeastAdditions: DS.hasMany('YeastAddition', {async: true}),
  notes: DS.hasMany('Note', {async: true}),
  user: DS.belongsTo('user', {async: true})
});
