import Ember from 'ember';
import WeightConversionMixin from '../../mixins/weight-conversion-mixin';
const { computed, inject } = Ember;
const { alias, oneWay } = computed;

export default Ember.Controller.extend(WeightConversionMixin, {
  applicationController: inject.controller('application'),
  hopsController: inject.controller('hops'),

  measureSystem: alias('applicationController.measureSystem'),
  hops: oneWay('hopsController.model'),

  forms: [ "Whole", "Pellet", "Plug" ],
  uses: [ "Boil", "Mash", "First Wort", "Aroma", "Dry Hop" ]

});
