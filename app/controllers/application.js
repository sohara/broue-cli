import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['login'],
  session: Ember.computed.alias('controllers.login.session'),
  user: function(key, value) {
    if (arguments.length > 1) {
      return value;
    }
    if ( this.get('session') !== null && typeof(this.get('session')) != 'undefined') {
      return this.store.find('user', this.get('session.user_id'));
    }
  }.property('session'),

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
      this.transitionToRoute('login');
      Ember.run.next(this, function() {
        this.clearStore();
      });
    }
  }
});
