import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['styles'],

  styles: function() {
    return this.get('controllers.styles');
  }.property('controllers.styles')
});
