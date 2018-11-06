import DS from 'ember-data';
import { computed } from '@ember/object';

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


  description: computed('productId', 'name', function() {
    let productId = this.get('productId');
    let name = this.get('name');
    return `${productId} - ${name}`;
  })
});
