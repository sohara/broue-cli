import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(value) {
  if (typeof value != "undefined") {
    return value / 1000;
  }
});
