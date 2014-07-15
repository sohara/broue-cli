import DS from 'ember-data';

export default DS.Model.extend({
  weightGrams: DS.attr('number'),
  weightOz: DS.attr('number'),
  brew: DS.belongsTo('brew'),
  fermentable: DS.belongsTo('fermentable')
});
