import Ember from 'ember';
const { inject } = Ember;

export default Ember.Component.extend({
  flash: inject.service(),
  classNames: 'alert',
  classNameBindings: ['alertSuccess', 'alertWarning', 'alertDanger'],

  willInsertElement: function() {
    this.$().hide();
  },

  didInsertElement: function() {
    this._super(...arguments);
    this.get('flash').on('show', this, this.show);
    this.get('flash').on('hide', this, this.hide);
  },

  // This is probably not currently necessary since the view remains
  // active throughout the app life cycle, but is generally good practice
  willDestroyElement: function() {
    this._super(...arguments);
    this.get('flash').off('show', this, this.show);
    this.get('flash').off('hide', this, this.hide);
  },

  show: function() {
    this.$().fadeIn(600);
  },

  hide: function() {
    this.$().fadeOut(600);
  },

  alertSuccess: function() {
    return this.get('flash.type') === 'success';
  }.property('flash.type'),

  alertWarning: function() {
    return this.get('flash.type') === 'warning';
  }.property('flash.type'),

  alertDanger: function() {
    return this.get('flash.type') ==='danger';
  }.property('flash.type'),

  actions: {
    hide: function() {
      this.trigger('hide');
    }
  }
});
