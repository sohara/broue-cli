import { oneWay, alias } from '@ember/object/computed';
import ObjectProxy from '@ember/object/proxy';

export default ObjectProxy.extend({
  name: alias('content.hop.name'),
  batchSizeLitres: oneWay('brew.batchSizeLitres'),
  gravityFactor: oneWay('brew.gravityFactor'),

  ibus: function() {
    var alphaAcidUnits = this.get("alphaAcidUnits");
    var utilization = this.get("utilization");
    var batchSizeLitres = this.get("batchSizeLitres");
    var ibus = ((alphaAcidUnits * utilization * 10) / batchSizeLitres);
    return Math.round(ibus * 100) / 100;
  }.property('alphaAcidUnits', 'utilization', 'batchSizeLitres'),

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
