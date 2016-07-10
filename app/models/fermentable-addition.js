import DS from 'ember-data';

export default DS.Model.extend({
  weightGrams: DS.attr('number'),
  weightOz: DS.attr('number'),
  brew: DS.belongsTo('brew', {async: false}),
  fermentable: DS.belongsTo('fermentable', {async: false})
});
