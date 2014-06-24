import Ember from 'ember';

var Router = Ember.Router.extend({
  location: BroueCliENV.locationType
});

Router.map(function() {
  this.resource('brews', function() {
    this.route('new');
    this.resource('brew', { path: ":brew_id" }, function() {
      this.route('show', { path: "" } );
      this.resource('specs', function() {
        // this.route('show', { path: "" });
        this.route('edit', { path: "edit" });
      });
    });
    this.route('edit', {path: ':brew_id/edit'});
  });
  this.resource('login');
  this.route('specs/show');
  this.route('specs/edit');
});

export default Router;
