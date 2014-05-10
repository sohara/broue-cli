var Router = Ember.Router.extend({
  location: ENV.locationType
});

Router.map(function() {
 this.resource('brews', function() {
   this.route('new');
   this.route('show', {path: ':brew_id'});
   this.route('edit', {path: ':brew_id/edit'});
 });
});

export default Router;
