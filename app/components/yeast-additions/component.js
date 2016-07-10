import Ember from 'ember';
import EditTableView from '../../mixins/edit-table-view';

export default Ember.Component.extend(EditTableView, {
  actions: {
    remove (model) {
      this.sendAction('remove', model);
    }
  }
});
