import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  name: DS.attr('string'),
  color: DS.attr('number'),
  totalYield: DS.attr('number'),
  supplier: DS.attr('string'),
  fermentableType: DS.attr('string'),
  fermentableAdditions: DS.hasMany('fermentableAddition'),

  description: computed("name", "supplier", function() {
    return `${this.name} ${this.supplier}`;
  })
});
