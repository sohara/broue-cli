import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
  headers: function() {
    console.log("In headers function");
    return {
      'auth-token': JSON.parse(localStorage.getItem('user')).token,
      'auth-email': JSON.parse(localStorage.getItem('user')).email
    };
  }.property("App.authToken", "App.authEmail")
});
