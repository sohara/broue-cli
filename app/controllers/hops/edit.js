import Ember from 'ember';
import WeightConversionMixin from '../../mixins/weight-conversion-mixin';

export default Ember.Controller.extend(WeightConversionMixin, {
  needs: ['hops', 'application'],

  measureSystem: Ember.computed.alias('controllers.application.measureSystem'),

  hops: function() {
    return this.get('controllers.hops');
  }.property('controllers.hops'),

  forms: [ "Whole", "Pellet", "Plug" ],
  uses: [ "Boil", "Mash", "First Wort", "Aroma", "Dry Hop" ]

});
