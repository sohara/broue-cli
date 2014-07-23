import Ember from 'ember';

export default Ember.Controller.extend({
  type: 'success',
  message: "test message",
  hidden: true,

  render: function(message, type) {
    this.setProperties({
      hidden: false,
      message: message,
      type: type || 'success'
    });
  },

  actions: {
    hide: function() {
      this.set('hidden', true);
    }
  }
});
