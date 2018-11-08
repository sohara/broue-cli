import Route from '@ember/routing/route';
import AuthenticatedRoute from '../mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {

  setupController: function() {
    this._super(...arguments);
    var styles = this.store.findAll('style');
    this.controllerFor('styles').set('model', styles);
    var user = this.controllerFor('application').get('user');
    var brews = this.store.query('brew', { user_id: user.get('id') });
    this.controllerFor('brews.index').set('model', brews);
  }

});
