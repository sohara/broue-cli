import { computed } from '@ember/object';
import { oneWay, alias } from '@ember/object/computed';
import ObjectProxy from '@ember/object/proxy';

export default ObjectProxy.extend({
  name: alias('content.hop.name'),
  batchSizeLitres: oneWay('brew.batchSizeLitres'),
  gravityFactor: oneWay('brew.gravityFactor'),

  ibus: computed('alphaAcidUnits', 'utilization', 'batchSizeLitres', function() {
    var alphaAcidUnits = this.get('alphaAcidUnits');
    var utilization = this.utilization;
    var batchSizeLitres = this.get('batchSizeLitres');
    var ibus = ((alphaAcidUnits * utilization * 10) / batchSizeLitres);
    return Math.round(ibus * 100) / 100;
  }),

  alphaAcidUnits: computed('alphaAcids', 'weightGrams', function() {
    return this.get('weightGrams') * this.get('alphaAcids');
  }),

  utilization: computed('gravityFactor', 'timeFactor', function() {
    return this.gravityFactor * this.timeFactor;
  }),

  timeFactor: computed('boilTime', function() {
    return (1 - Math.exp(-0.04 * this.get('boilTime'))) / 4.15;
  })
});
