import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
  headers: function() {
    var session = this.login.get('session');
    return {
      'auth-token': session.token,
      'auth-email': session.email
    };
  }.property("login.session")
});
