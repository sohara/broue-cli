import Ember from 'ember';
import WeightConversionMixinMixin from 'broue/mixins/weight-conversion-mixin';

module('WeightConversionMixinMixin');

// Replace this with your real tests.
test('it works', function() {
  var WeightConversionMixinObject = Ember.Object.extend(WeightConversionMixinMixin);
  var subject = WeightConversionMixinObject.create();
  ok(subject);
});
