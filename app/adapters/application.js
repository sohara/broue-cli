import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
  namespace: 'api/v1',
  coalesceFindRequests: true,
  headers: function() {
    var session = this.login.get('session');
    if (session !== null) {
      return {
        'auth-token': session.token,
        'auth-email': session.email
      };
    } else { return {}; }
  }.property("login.session")
});
