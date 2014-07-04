import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['hops'],

  hops: function() {
    return this.get('controllers.hops');
  }.property('controllers.hops'),

  forms: [ "Whole", "Pellet", "Plug" ],
  uses: [ "Boil", "Mash", "First Wort", "Aroma", "Dry Hop" ]
});
