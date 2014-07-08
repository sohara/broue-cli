import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  batchSize: DS.attr('number'),
  boilLoss: DS.attr('number'),
  efficiency: DS.attr('number'),
  grainTemp: DS.attr('number'),
  brewDate: DS.attr('string'),
  targetMashTemp: DS.attr('number'),
  waterGrainRatio: DS.attr('number'),
  recordedOriginalGravity: DS.attr('number'),
  recordedFinalGravity: DS.attr('number'),
  recordedPostBoilVolume: DS.attr('number'),
  createdAt: DS.attr('date'),
  style: DS.belongsTo('Style'),
  fermentableAdditions: DS.hasMany('FermentableAddition'),
  hopAdditions: DS.hasMany('HopAddition'),
  yeastAdditions: DS.hasMany('YeastAddition'),
  notes: DS.hasMany('Note')
});
