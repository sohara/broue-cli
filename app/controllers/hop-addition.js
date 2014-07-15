import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: [ 'brew', 'application' ],
  measureSystem: Ember.computed.alias('controllers.application.measureSystem'),
  name: Ember.computed.alias('hop.name'),
  batchSize: Ember.computed.alias('controllers.brew.batchSize'),
  gravityFactor: Ember.computed.alias('controllers.brew.gravityFactor'),
  canEdit: Ember.computed.alias('controllers.brew.canEdit'),

  ibus: function() {
    var alphaAcidUnits = this.get("alphaAcidUnits");
    var utilization = this.get("utilization");
    var batchSize = this.get("batchSize");
    var ibus = ((alphaAcidUnits * utilization * 10) / batchSize);
    return Math.round(ibus * 100) / 100;
  }.property('alphaAcidUnits', 'utilization', 'batchSize'),

  alphaAcidUnits: function() {
    return this.get('weightGrams') * this.get('alphaAcids');
  }.property('alphaAcids', 'weightGrams'),

  utilization: function() {
    return this.get("gravityFactor") * this.get("timeFactor");
  }.property('gravityFactor', 'timeFactor'),

  timeFactor: function() {
    return (1 - Math.exp(-0.04 * this.get('boilTime'))) / 4.15;
  }.property('boilTime')

});
