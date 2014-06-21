import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
  headers: function() {
    var currentUser = this.login.get('currentUser');
    return {
      'auth-token': currentUser.token,
      'auth-email': currentUser.email
    };
  }.property("login.currentUser")
});
