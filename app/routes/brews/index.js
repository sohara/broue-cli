export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
  model: function() {
    return this.store.find('brew');
  }
});
