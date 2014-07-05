import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  supplier: DS.attr('string'),
  form: DS.attr('string'),
  productId: DS.attr('string'),
  notes: DS.attr('string'),
  flocculation: DS.attr('string'),
  temperatureLow: DS.attr('number'),
  temperatureHigh: DS.attr('number'),
  attenuationLow: DS.attr('number'),
  attenuationHigh: DS.attr('number'),
  yeastAdditions: DS.hasMany('YeastAddition'),


  description: function() {
    return "%@1 - %@2".fmt(this.get('productId'), this.get('name'));
  }.property('productId', 'name')
});
