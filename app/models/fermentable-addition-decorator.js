import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import ObjectProxy from '@ember/object/proxy';

export default ObjectProxy.extend({
  fermentableType: oneWay('fermentable.fermentableType'),
  color: oneWay('fermentable.color'),

  mashable: computed('fermentableType', function() {
    var type = this.fermentableType;
    return (type === "Grain" || type === "Adjunct");
  }),

  extractUnits: computed('content.{weightGrams,fermentable.totalYield}', function() {
    var weight = this.get("content.weightGrams");
    var extractYield = this.get("content.fermentable.totalYield");
    var extract = (weight / 1000) * (extractYield / 100);
    return Math.round(extract * 100) / 100;
  }),

  percentExtract: computed('extractUnits', 'brew.totalExtractUnits', function() {
    var extractUnits = this.extractUnits;
    var totalExtractUnits = this.get('brew.totalExtractUnits');
    var percentExtract = (extractUnits / totalExtractUnits);
    return Math.round(percentExtract * 10000) / 10;
  })
});
