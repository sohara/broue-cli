import DS from 'ember-data';

export default DS.Model.extend({
  subcategoryId: DS.attr('string'),
  subcategoryName: DS.attr('string'),

  fullName: function() {
    return `${this.get('subcategoryId')} - ${this.get('subcategoryName')}`;
  }.property('subcategoryId', 'subcategoryName')

});
