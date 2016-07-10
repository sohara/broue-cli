import Ember from 'ember';

export default Ember.Mixin.create({
  computedColspan: function() {
    return this.get('canEdit') ? 3 : 1;
  }.property('canEdit')
});
