import Ember from 'ember';

export default Ember.View.extend({

  didInsertElement: function() {
    var $modal = this.$('.modal').modal();

    $modal.on('hidden.bs.modal', function (e) {
      this.get('controller').send('closeModal');
    }.bind(this));
  },

  willDestroyElement: function() {
    this.$('.modal').modal('hide');
    // FML jquery :'(
    $('.modal-backdrop').remove();
  }
});
