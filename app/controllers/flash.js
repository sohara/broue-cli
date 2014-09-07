import Ember from 'ember';

export default Ember.Controller.extend(Ember.Evented, {
  type: 'success',
  message: "",

  render: function(message, type) {
    this.setProperties({
      message: message,
      type: type || 'success'
    });
    Ember.run.later(this, function() {
      this.trigger('show');
    });
  },

  actions: {
    hide: function() {
      this.trigger('hide');
    }
  }
});
