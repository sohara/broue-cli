import Component from '@ember/component';
import EditTableView from '../../mixins/edit-table-view';

export default Component.extend(EditTableView, {
  actions: {
    remove (model) {
      this.sendAction('remove', model);
    }
  }
});
