var Router = Ember.Router.extend({
  rootURL: ENV.rootURL,
  location: 'auto'
});

Router.map(function() {
  this.resource('brews', function() {
    this.route('new');
    this.route('show', {path: ':brew_id'});
    this.route('edit', {path: ':brew_id/edit'});
  });
});

export default Router;
