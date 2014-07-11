import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  username: DS.attr('string'),
  slug: DS.attr('string'),
  bio: DS.attr('string'),
  image: DS.attr(),
  brews: DS.hasMany('brew')
});
