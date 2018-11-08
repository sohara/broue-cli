import Route from '@ember/routing/route';

export default Route.extend({
  setupController () {
    this._super(...arguments);
    var brews = this.store.findAll('brew', {limit: 10});
    this.controllerFor('brews').set('model', brews);
    var users = this.store.findAll('user', {limit: 10});
    this.controllerFor('users').set('model', users);
  }
});
