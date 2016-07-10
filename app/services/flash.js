import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
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
});
