import { next } from '@ember/runloop';
import Controller, { inject as controller } from '@ember/controller';
import { alias, reads } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  loginController: controller('login'),
  session: alias('loginController.session'),
  measureSystemService: service('measure-system'),
  measureSystem: reads('measureSystemService.system'),

  isMetric: computed('measureSystem', function() {
    return this.measureSystem === 'metric';
  }),

  isUS: computed('measureSystem', function() {
    return this.measureSystem === 'us';
  }),

  user: computed('session', {
    get: function () {
      if ( this.session !== null && typeof(this.session) !== 'undefined') {
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
      this.flash.render("Successfully logged out");
      next(this, function() {
        // this.clearStore();
      });
    },
    setMeasureSystem: function(measureSystem) {
      this.measureSystemService.setSystem(measureSystem);
    }
  }
});
