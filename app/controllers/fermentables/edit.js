import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['fermentables'],

  fermentables: function() {
    return this.get('controllers.fermentables');
  }.property('controllers.fermentables')
});
