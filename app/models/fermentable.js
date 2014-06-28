import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  color: DS.attr('number'),
  totalYield: DS.attr('number'),
  supplier: DS.attr('string'),
  fermentableType: DS.attr('string'),
  fermentableAdditions: DS.hasMany('fermentableAddition')
});