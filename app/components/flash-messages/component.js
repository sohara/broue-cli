import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  flash: service(),
  classNames: 'alert',
  classNameBindings: ['alertSuccess', 'alertWarning', 'alertDanger'],

  willInsertElement: function() {
    this.$().hide();
  },

  didInsertElement: function() {
    this._super(...arguments);
    this.flash.on('show', this, this.show);
    this.flash.on('hide', this, this.hide);
  },

  // This is probably not currently necessary since the view remains
  // active throughout the app life cycle, but is generally good practice
  willDestroyElement: function() {
    this._super(...arguments);
    this.flash.off('show', this, this.show);
    this.flash.off('hide', this, this.hide);
  },

  show: function() {
    this.$().fadeIn(600);
  },

  hide: function() {
    this.$().fadeOut(600);
  },

  alertSuccess: computed('flash.type', function() {
    return this.get('flash.type') === 'success';
  }),

  alertWarning: computed('flash.type', function() {
    return this.get('flash.type') === 'warning';
  }),

  alertDanger: computed('flash.type', function() {
    return this.get('flash.type') ==='danger';
  }),

  actions: {
    hide: function() {
      this.trigger('hide');
    }
  }
});
