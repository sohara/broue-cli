import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    console.log("In brews index model hook");
    return this.modelFor('brews');
  }
});
