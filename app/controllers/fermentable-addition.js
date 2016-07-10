import Ember from 'ember';

export default Ember.Controller.extend({
  needs: [ 'fermentable-additions', 'brew', 'application' ],
  measureSystem: Ember.computed.alias('controllers.application.measureSystem'),
  name: Ember.computed.alias('model.fermentable.name'),
  fermentableType: Ember.computed.alias('model.fermentable.fermentableType'),
  extractYield: Ember.computed.alias('model.fermentable.totalYield'),
  color: Ember.computed.alias('model.fermentable.color'),
  totalExtractUnits: Ember.computed.alias('controllers.fermentable-additions.totalExtractUnits'),
  canEdit: Ember.computed.alias('controllers.brew.canEdit'),

  mashable: function() {
    var type = this.get('fermentableType');
    return (type === "Grain" || type === "Adjunct");
  }.property('fermentableType'),

  extractUnits: function() {
    var weight = this.get("model.weightGrams");
    var extractYield = this.get("extractYield");
    var extract = (weight / 1000) * (extractYield / 100);
    return Math.round(extract * 100) / 100;
  }.property("model.weightGrams", "extractYield"),

  percentExtract: function() {
    var extractUnits = this.get('extractUnits');
    var totalExtractUnits = this.get('totalExtractUnits');
    var percentExtract = (extractUnits / totalExtractUnits);
    return Math.round(percentExtract * 10000) / 100;
  }.property('extractUnits', 'totalExtractUnits')

});
