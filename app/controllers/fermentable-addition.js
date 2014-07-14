import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: [ 'fermentableAdditions', 'brew' ],

  name: Ember.computed.alias('fermentable.name'),
  fermentableType: Ember.computed.alias('fermentable.fermentableType'),
  extractYield: Ember.computed.alias('fermentable.totalYield'),
  color: Ember.computed.alias('fermentable.color'),
  totalExtractUnits: Ember.computed.alias('controllers.fermentableAdditions.totalExtractUnits'),
  canEdit: Ember.computed.alias('controllers.brew.canEdit'),

  mashable: function() {
    var type = this.get('fermentableType');
    return (type === "Grain" || type === "Adjunct");
  }.property('fermentableType'),

  extractUnits: function() {
    var weight = this.get("weight");
    var extractYield = this.get("extractYield");
    var extract = (weight / 1000) * (extractYield / 100);
    return Math.round(extract * 100) / 100;
  }.property("weight", "extractYield"),

  percentExtract: function() {
    var extractUnits = this.get('extractUnits');
    var totalExtractUnits = this.get('totalExtractUnits');
    var percentExtract = (extractUnits / totalExtractUnits);
    return Math.round(percentExtract * 10000) / 100;
  }.property('extractUnits', 'totalExtractUnits')
});
