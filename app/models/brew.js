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
  recordedPostBoilVolume: DS.attr('number'),
  createdAt: DS.attr('date'),
  style: DS.belongsTo('Style'),
  fermentableAdditions: DS.hasMany('FermentableAddition', { async: true }),
  hopAdditions: DS.hasMany('HopAddition', { async: true })
});
