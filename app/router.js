import Ember from 'ember';

var Router = Ember.Router.extend({
  location: BroueCliENV.locationType
});

Router.map(function() {
  this.route('login');
  this.resource('brews', function() {
    this.route('new');
    this.route('show', {path: ':brew_id'});
    this.route('edit', {path: ':brew_id/edit'});
  });
  this.route('yeast');
});

export default Router;
