import Ember from 'ember';

export default Ember.Controller.extend(Ember.Evented, {
  type: 'success',
  message: "test message",

  render: function(message, type) {
    this.setProperties({
      message: message,
      type: type || 'success'
    });
    this.trigger('show');
  },

  actions: {
    hide: function() {
      this.trigger('hide');
    }
  }
});
