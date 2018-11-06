import { next } from '@ember/runloop';
import Controller, { inject as controller } from '@ember/controller';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Controller.extend({
  loginController: controller('login'),
  session: alias('loginController.session'),
  measureSystem: 'us',

  isMetric: function() {
    return this.get('measureSystem') === 'metric';
  }.property('measureSystem'),
  isUS: function() {
    return this.get('measureSystem') === 'us';
  }.property('measureSystem'),

  user: computed('session', {
    get: function () {
      if ( this.get('session') !== null && typeof(this.get('session')) !== 'undefined') {
        return this.store.find('user', this.get('session.user_id'));
      }
    },
    set: function (key, user) {
      return user;
    }
  }),

  clearStore: function() {
    var typeMaps = this.store.get('typeMaps');
    for(var typeId in typeMaps) {
      if(typeMaps.hasOwnProperty(typeId)) {
        var modelName = typeMaps[typeId].type.toString().split(":")[1];
        this.store.unloadAll(modelName);
      }
    }
  },

  actions: {
    logout: function() {
      this.setProperties({ session: null, user: null });
      this.transitionToRoute('index');
      this.get('flash').render("Successfully logged out");
      next(this, function() {
        // this.clearStore();
      });
    },
    setMeasureSystem: function(measureSystem) {
      this.set('measureSystem', measureSystem);
    }
  }
});
