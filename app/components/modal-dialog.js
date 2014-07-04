import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['modal', 'fade'],
  didInsertElement: function() {
    var $modal = this.$().modal();

    $modal.on('hidden.bs.modal', function () {
      this.sendAction('close');
    }.bind(this));
  },

  willDestroyElement: function() {
    this.$().modal('hide');
    // FML jquery :'(
    Ember.$('.modal-backdrop').remove();
  },

  actions: {
    cancel: function() {
      console.log("In component cancel");
      this.sendAction('cancel');
    },
    save: function(param) {
      this.sendAction('save', param);
    },
  }
});
