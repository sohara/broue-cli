import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
    // var styles = this.store.find('style');
    // this.controllerFor('styles').set('model', styles);
    // var user = this.controllerFor('application').get('user');
    // var brews = this.store.find('brew', { user_id: user.get('id') });
    // this.controllerFor('brews/index').set('model', brews);
    var brews = this.store.find('brew', {limit: 10});
    this.controllerFor('brews').set('content', brews);
    var users = this.store.find('user', {limit: 10});
    this.controllerFor('users').set('content', users);
  }
});
