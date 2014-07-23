import Ember from 'ember';

export default Ember.View.extend({
  classNames: 'alert',
  classNameBindings: ['hidden', 'alertSuccess', 'alertWarning', 'alertDanger'],
  message: null,

  hidden: function() {
    return this.get('controller.hidden');
  }.property('controller.hidden'),

  alertSuccess: function() {
    return this.get('controller.type') == 'success';
  }.property('controller.type'),

  alertWarning: function() {
    return this.get('controller.type') == 'warning';
  }.property('controller.type'),

  alertDanger: function() {
    return this.get('controller.type') == 'danger';
  }.property('controller.type')
});
