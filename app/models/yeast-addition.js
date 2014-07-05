import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  amount: DS.attr('number'),
  unit: DS.attr('string'),

  productId: Ember.computed.alias('yeast.productId'),
  name: Ember.computed.alias('yeast.name'),
  supplier: Ember.computed.alias('yeast.supplier'),
  form: Ember.computed.alias('yeast.form'),
  notes: Ember.computed.alias('yeast.notes'),
  description: Ember.computed.alias('yeast.description'),

  brew: DS.belongsTo('Brew'),
  yeast: DS.belongsTo('Yeast', {async: true})
});
