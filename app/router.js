import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('signup');
  this.route('profile', function() {
    this.route('show', { path: "" });
    this.route('edit', { path: "edit" });
  });
  this.route('user', {path: "users/:user_id"});
  this.route('brews', {path: "my-brews"}, function() {
    this.route('new');
    this.route('edit', {path: ':brew_id/edit'});
    });
  this.route('brew', { path: "/brews/:brew_id" }, function() {
    // Make 'recipe' the default route for viewing a brew
    // at '/brews/:brew_id
    this.route('recipe', { path: "", resetNamespace: true }, function() {
      this.route('fermentables', {resetNamespace: true}, function() {
        this.route('edit', { path: ':resource_id/edit' });
        this.route('new');
      });
      this.route('hops', {resetNamespace: true}, function() {
        this.route('edit', { path: ':resource_id/edit' });
        this.route('new');
      });
      this.route('yeasts', {resetNamespace: true}, function() {
        this.route('edit', { path: ':resource_id/edit' });
        this.route('new');
      });
    });
    this.route('specs', {resetNamespace: true}, function() {
      this.route('edit', { path: "edit" });
    });
    this.route('brew_day', {resetNamespace: true}, function() {
      this.route('edit', { path: "edit" });
    });
    this.route('notes', {resetNamespace: true}, function() {
      this.route('edit', { path: ':resource_id/edit' });
      this.route('new');
    });
  });
});

export default Router.reopen({
  notifyGoogleAnalytics: function() {
    if (typeof(window.ga) !== 'undefined') {
      return window.ga('send', 'pageview', {
        'page': this.get('url'),
        'title': this.get('url')
      });
    }
  }.on('didTransition')
});
