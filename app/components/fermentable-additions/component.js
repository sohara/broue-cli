import Ember from 'ember';
import EditTableView from '../../mixins/edit-table-view';
const { computed, ObjectProxy } = Ember;

export default Ember.Component.extend(EditTableView, {
  decoratedAdditions: computed('additions', function () {
    return this.get('additions').map(addition => {
      return ObjectProxy.created({
        content: addition
      });
    });
  })
});
