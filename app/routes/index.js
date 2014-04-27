export default Ember.Route.extend({
  beforeModel: function() {
    console.log("Trying to transition!")
    this.transitionTo('brews');
  }
});
