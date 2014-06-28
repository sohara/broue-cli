import DS from 'ember-data';

export default DS.Model.extend({
  form: DS.attr('string'),
  boilTime: DS.attr('number'),
  weight: DS.attr('number'),
  alphaAcids: DS.attr('number'),
  use: DS.attr('string'),


  brew: DS.belongsTo('Brew'),
  hop: DS.belongsTo('Hop')
});