import Ember from 'ember';

var Router = Ember.Router.extend({
  location: BroueCliENV.locationType
});

Router.map(function() {
  this.resource('login');
  this.resource('signup');
  this.resource('profile', function() {
    this.route('show', { path: "" });
    this.route('edit', { path: "edit" });
  });
  this.resource('user', {path: "users/:user_id"});
  this.resource('brews', {path: "my-brews"}, function() {
    this.route('new');
    this.route('edit', {path: ':brew_id/edit'});
    });
  this.resource('brew', { path: "/brews/:brew_id" }, function() {
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
    this.resource('notes', function() {
      this.route('edit', { path: ':resource_id/edit' });
      this.route('new');
    });
  });
});

export default Router.reopen({
  notifyGoogleAnalytics: function() {
    if (typeof(ga) !== 'undefined') {
      return ga('send', 'pageview', {
        'page': this.get('url'),
        'title': this.get('url')
      });
    }
  }.on('didTransition')
});;
