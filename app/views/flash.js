import Ember from 'ember';

export default Ember.View.extend({
  classNames: 'alert',
  classNameBindings: ['alertSuccess', 'alertWarning', 'alertDanger'],
  message: null,


  didInsertElement: function() {
    this.$().hide();
    this.get('controller').on('show', this, this.show);
    this.get('controller').on('hide', this, this.hide);
  },

  // This is probably not currently necessary since the view remains
  // active throughout the app life cycle, but is generally good practice
  willClearRender: function() {
    this.get('controller').off('show', this, this.show);
    this.get('controller').off('hide', this, this.hide);
  },

  show: function() {
    this.$().fadeIn(600);
  },

  hide: function() {
    this.$().fadeOut(600);
  },

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
