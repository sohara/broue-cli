import Ember from 'ember';

export default Ember.Route.extend({
  setupController () {
    this._super(...arguments);
    var brews = this.store.findAll('brew', {limit: 10});
    this.controllerFor('brews').set('content', brews);
    var users = this.store.findAll('user', {limit: 10});
    this.controllerFor('users').set('content', users);
  }
});
