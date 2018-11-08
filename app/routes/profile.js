import Route from '@ember/routing/route';
import AuthenticatedRoute from '../mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
  controllerName: 'user',

  model: function() {
    return this.controllerFor('application').get('user');
  },


  setupController: function(controller, model) {
    this._super(controller, model);
    var brews = this.store.query('brew', {user_id: model.get('id')});
    this.controllerFor('brews/index').set('model', brews);
  }

});
