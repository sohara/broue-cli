import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['brews/index'],

  recentBrews: function() {
    return this.get('controllers.brews/index.recentBrews')
  }.property('controllers.brews/index.recentBrews')
});
