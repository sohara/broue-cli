import Ember from 'ember';

var Router = Ember.Router.extend({
  location: BroueCliENV.locationType
});

Router.map(function() {
  this.resource('brews', function() {
    this.route('new');
    this.route('show', {path: ':brew_id'});
    this.route('edit', {path: ':brew_id/edit'});
  });
  this.resource('login');
});

export default Router;
