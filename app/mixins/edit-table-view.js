import Mixin from '@ember/object/mixin';

export default Mixin.create({
  computedColspan: function() {
    return this.get('canEdit') ? 3 : 1;
  }.property('canEdit')
});
