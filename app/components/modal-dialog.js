import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['modal', 'fade'],
  didInsertElement: function() {
    this._super(...arguments);
    var $modal = this.$().modal();

    $modal.on('hidden.bs.modal', function () {
      if (Ember.$('#ember-testing-container').length === 0) {
        this.sendAction('close');
      }
    }.bind(this));
  },

  actions: {
    cancel: function() {
      this.$().modal('hide');
    },
    save: function(param) {
      this.sendAction('save', param);
    },
  }
});
