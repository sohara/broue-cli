import Ember from 'ember';
import AuthenticatedRoute from '../mixins/authenticated-route';

export default Ember.Route.extend(AuthenticatedRoute, {
  controllerName: 'user',

  model: function() {
    return this.controllerFor('application').get('user');
  },


  setupController: function(controller, model) {
    this._super(controller, model);
    var ownBrews = this.controllerFor('brews/index');
    if (ownBrews.get('length') === 0) {
      var brews = this.store.find('brew', {user_id: model.get('id')});
      this.controllerFor('brews/index').set('model', brews);
    }
    controller.set('recentBrews', ownBrews);
  }

});
