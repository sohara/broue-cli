import { alias } from '@ember/object/computed';
import DS from 'ember-data';

export default DS.Model.extend({
  amount: DS.attr('number'),
  unit: DS.attr('string'),

  productId: alias('yeast.productId'),
  name: alias('yeast.name'),
  supplier: alias('yeast.supplier'),
  form: alias('yeast.form'),
  notes: alias('yeast.notes'),
  description: alias('yeast.description'),

  brew: DS.belongsTo('Brew', {async: false}),
  yeast: DS.belongsTo('Yeast', {async: false})
});
