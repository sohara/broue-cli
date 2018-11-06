import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({
  computedColspan: computed('canEdit', function() {
    return this.get('canEdit') ? 3 : 1;
  })
});
