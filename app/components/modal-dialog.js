import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['modal', 'fade'],
  didInsertElement: function() {
    var $modal = this.$().modal();

    $modal.on('hidden.bs.modal', function () {
      this.sendAction('close');
    }.bind(this));
  },

  actions: {
    cancel: function() {
      this.$().modal('hide');
      this.sendAction('close');
    },
    save: function(param) {
      this.sendAction('save', param);
    },
  }
});
