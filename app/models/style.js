import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  subcategoryId: DS.attr('string'),
  subcategoryName: DS.attr('string'),

  fullName: computed('subcategoryId', 'subcategoryName', function() {
    return `${this.subcategoryId} - ${this.subcategoryName}`;
  })

});
