import Ember from 'ember';
const { computed, ObjectProxy } = Ember;
const { oneWay } = computed;

export default ObjectProxy.extend({
  fermentableType: oneWay('fermentable.fermentableType'),
  color: oneWay('fermentable.color'),

  mashable: function() {
    var type = this.get('fermentableType');
    return (type === "Grain" || type === "Adjunct");
  }.property('fermentableType'),

  extractUnits: function() {
    var weight = this.get("content.weightGrams");
    var extractYield = this.get("content.fermentable.totalYield");
    var extract = (weight / 1000) * (extractYield / 100);
    return Math.round(extract * 100) / 100;
  }.property("content.weightGrams", "content.fermentable.totalYield"),

  percentExtract: function() {
    var extractUnits = this.get('extractUnits');
    var totalExtractUnits = this.get('brew.totalExtractUnits');
    var percentExtract = (extractUnits / totalExtractUnits);
    return Math.round(percentExtract * 10000) / 100;
  }.property('extractUnits', 'brew.totalExtractUnits')
});
