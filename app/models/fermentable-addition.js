import DS from 'ember-data';

export default DS.Model.extend({
  weight: DS.attr('number'),
  brew: DS.belongsTo('brew'),
  fermentable: DS.belongsTo('fermentable', { async: true })
});
