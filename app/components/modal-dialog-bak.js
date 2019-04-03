import $ from 'jquery';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['modal', 'fade'],
  didInsertElement: function() {
    this._super(...arguments);
    // var $modal = this.$().modal();

    // $modal.on('hidden.bs.modal', function () {
    //   if ($('#ember-testing-container').length === 0) {
    //     this.close();
    //   }
    // }.bind(this));
  },

  actions: {
    cancel: function() {
      this.$().modal('hide');
    }
  }
});
