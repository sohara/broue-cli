import Ember from 'ember';
import WeightConversionMixin from '../../mixins/weight-conversion-mixin';

export default Ember.ObjectController.extend(WeightConversionMixin, {
  needs: ['fermentables', 'application'],

  measureSystem: Ember.computed.alias('controllers.application.measureSystem'),

  fermentables: function() {
    return this.get('controllers.fermentables');
  }.property('controllers.fermentables'),

});
