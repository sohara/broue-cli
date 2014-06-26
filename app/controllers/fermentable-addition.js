import Ember from 'ember';

export default Ember.ObjectController.extend({
  name: Ember.computed.alias('fermentable.name'),
  fermentableType: Ember.computed.alias('fermentable.fermentableType'),
  extractYield: Ember.computed.alias('fermentable.totalYield'),
  color: Ember.computed.alias('fermentable.color'),

  mashable: function() {
    var type = this.get('fermentableType');
    return (type == "Grain" || type == "Adjunct")
  }.property('fermentableType'),

  // extractYield: function() {
  //   return @get('fermentable.totalYield')
  // }.property("fermentable.totalYield").cacheable()
  extractUnits: function() {
    var weight = this.get("weight");
    var extractYield = this.get("extractYield");
    var extract = (weight / 1000) * (extractYield / 100);
    return Math.round(extract * 100) / 100;
  }.property("weight", "extractYield")
});
