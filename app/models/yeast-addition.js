import DS from 'ember-data';

export default DS.Model.extend({
  amount: DS.attr('number'),
  unit: DS.attr('string'),

  productId: Ember.computed.alias('yeast.productId'),
  name: Ember.computed.alias('yeast.name'),
  supplier: Ember.computed.alias('yeast.supplier'),
  form: Ember.computed.alias('yeast.form'),
  notes: Ember.computed.alias('yeast.notes'),

  // productId: (->
  //   @get("yeast.productId")
  // ).property("yeast.productId").cacheable()
  //
  // name: (->
  //   @get("yeast.name")
  // ).property("yeast.name").cacheable()
  //
  // supplier: (->
  //   @get("yeast.supplier")
  // ).property("yeast.supplier").cacheable()
  //
  // form: (->
  //   @get("yeast.form")
  // ).property("yeast.form").cacheable()
  //
  // notes: (->
  //   @get("yeast").get "notes"
  // ).property("yeast").cacheable()

  brew: DS.belongsTo('Brew'),
  yeast: DS.belongsTo('Yeast')
});
