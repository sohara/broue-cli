import Ember from 'ember';
import AuthenticatedRoute from '../mixins/authenticated-route';

export default Ember.Route.extend(AuthenticatedRoute, {

  setupController: function(controller, model) {
    this._super(controller, model);
    var styles = this.store.find('style');
    this.controllerFor('styles').set('model', styles);
    var user = this.controllerFor('application').get('user');
    var brews = this.store.find('brew', { user_id: user.get('id') });
    this.controllerFor('brews/index').set('model', brews);
  }

});
