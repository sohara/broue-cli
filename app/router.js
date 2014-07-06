import Ember from 'ember';

var Router = Ember.Router.extend({
  location: BroueCliENV.locationType
});

Router.map(function() {
  this.resource('brews', function() {
    this.route('new');
    this.resource('brew', { path: ":brew_id" }, function() {
      // Make 'recipe' the default route for viewing a brew
      // at '/brews/:brew_id
      this.resource('recipe', { path: "" }, function() {
        this.resource('fermentables', function() {
          this.route('edit', { path: ':resource_id/edit' });
          this.route('new');
        });
        this.resource('hops', function() {
          this.route('edit', { path: ':resource_id/edit' });
          this.route('new');
        });
        this.resource('yeasts', function() {
          this.route('edit', { path: ':resource_id/edit' });
          this.route('new');
        });
      });
      this.resource('specs', function() {
        this.route('edit', { path: "edit" });
      });
      this.resource('brew_day', function() {
        this.route('edit', { path: "edit" });
      });
    });
    this.route('edit', {path: ':brew_id/edit'});
  });
  this.resource('login');
  this.route('specs/show');
  this.route('specs/edit');
  this.route('brew_day/edit');
});

export default Router;
